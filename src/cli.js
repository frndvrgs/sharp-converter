#!/usr/bin/env node

import { parseArgs } from "node:util"
import { configure } from "./configure.js"
import { convert } from "./convert.js"

const { values, positionals } = parseArgs({
  options: {
    config: { type: "boolean", short: "c", default: false },
    upgrade: { type: "boolean", short: "u", default: false },
    input: { type: "string", short: "i", default: "./input" },
    output: { type: "string", short: "o", default: "./output" },
    clean: { type: "boolean", default: false },
    help: { type: "boolean", short: "h", default: false },
  },
  allowPositionals: true,
  strict: true,
})

const subcommand = positionals[0]

if (values.help) {
  console.log(`
  sharpc — batch image conversion powered by Sharp

  Usage:
    sharpc                     convert images using config or defaults
    sharpc init                create sharpc.json in current directory
    sharpc -c                  interactive configuration wizard
    sharpc -i <dir> -o <dir>   specify input/output directories
    sharpc --clean             clear output directory before converting

  Options:
    -c, --config    run interactive configuration
    -i, --input     input directory (default: ./input)
    -o, --output    output directory (default: ./output)
    --clean         clear output directory first
    -h, --help      show this help

  Config resolution:
    1. sharpc.json in current directory
    2. ~/.config/sharp-converter/sharpc.json
    3. built-in defaults
`)
  process.exit(0)
}

if (subcommand === "init") {
  await configure({ forceLocal: true })
} else if (values.config) {
  await configure()
} else {
  await convert({ input: values.input, output: values.output, clean: values.clean })
}
