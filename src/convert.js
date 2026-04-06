import sharp from "sharp"
import fs from "node:fs/promises"
import path from "node:path"
import { loadConfig } from "./config.js"

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".tiff", ".avif"])

function normalizeFilename(filename) {
  return filename
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function applyFormat(pipeline, format, quality) {
  const opts = quality ? { quality } : {}
  const methods = { webp: "webp", jpg: "jpeg", jpeg: "jpeg", png: "png", avif: "avif" }
  const method = methods[format]
  return method ? pipeline[method](opts) : pipeline
}

async function processImage(inputPath, outputPath, config) {
  let pipeline = sharp(inputPath)

  if (config.resize) {
    pipeline = pipeline.resize({
      width: config.resize.width || undefined,
      height: config.resize.height || undefined,
      fit: config.resize.fit || "inside",
      withoutEnlargement: config.resize.withoutEnlargement ?? false,
    })
  }

  pipeline = applyFormat(pipeline, config.format, config.quality)
  await pipeline.toFile(outputPath)
}

export async function convert({ input, output, clean }) {
  const config = await loadConfig()

  await fs.mkdir(input, { recursive: true })
  await fs.mkdir(output, { recursive: true })

  if (clean) {
    const existing = await fs.readdir(output)
    await Promise.all(existing.map((f) => fs.unlink(path.join(output, f))))
    console.log(`  Cleared ${output}/`)
  }

  const files = (await fs.readdir(input)).filter((f) => IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase()))

  if (files.length === 0) {
    console.log("  No images found in", input)
    return
  }

  console.log(`  Processing ${files.length} images → ${config.format} (q${config.quality})`)

  for (const file of files) {
    const inputPath = path.join(input, file)
    const baseName = normalizeFilename(path.parse(file).name)
    const outputPath = path.join(output, `${baseName}.${config.format}`)

    const inputStat = await fs.stat(inputPath)
    await processImage(inputPath, outputPath, config)
    const outputStat = await fs.stat(outputPath)

    const ratio = ((1 - outputStat.size / inputStat.size) * 100).toFixed(0)
    const size = (outputStat.size / 1024).toFixed(0)
    console.log(`  ${file} → ${baseName}.${config.format}  ${size}kb  (${ratio}% smaller)`)
  }

  process.exit(0)
}
