#!/usr/bin/env node

import { parseArgs } from "node:util"
import { configure } from "./configure.js"
import { convert } from "./convert.js"

const { values } = parseArgs({
  options: {
    config: { type: "boolean", short: "c", default: false },
    upgrade: { type: "boolean", short: "u", default: false },
    input: { type: "string", short: "i", default: "./input" },
    output: { type: "string", short: "o", default: "./output" },
    clean: { type: "boolean", default: false },
    help: { type: "boolean", short: "h", default: false },
  },
  strict: true,
})

if (values.help) {
  console.log(`
  sharpc — batch image conversion powered by Sharp

  Usage:
    sharpc                     convert images using .sharpc.json or defaults
    sharpc -c                  interactive configuration wizard
    sharpc -i <dir> -o <dir>   specify input/output directories
    sharpc --clean             clear output directory before converting

  Options:
    -c, --config    run interactive configuration
    -i, --input     input directory (default: ./input)
    -o, --output    output directory (default: ./output)
    --clean         clear output directory first
    -h, --help      show this help
`)
  process.exit(0)
}

if (values.config) {
  await configure()
} else {
  await convert({ input: values.input, output: values.output, clean: values.clean })
}
