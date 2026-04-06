import { loadConfig, saveConfig } from "./config.js"
import { ask, close, confirm, heading, info, select, success } from "./prompt.js"

export async function configure({ forceLocal = false } = {}) {
  const config = await loadConfig()

  heading("Sharp Converter — Configuration")

  config.format = await select("Output format", ["webp", "jpg", "png", "avif"], config.format)
  config.quality = parseInt(await ask("Quality (1-100)", config.quality), 10)

  const wantResize = await confirm("Configure resize?", config.resize != null)

  if (wantResize) {
    heading("Resize")

    const width = await ask("Width (blank for auto)", config.resize?.width ?? "")
    const height = await ask("Height (blank for auto)", config.resize?.height ?? "")

    config.resize = {
      width: width ? parseInt(width, 10) : null,
      height: height ? parseInt(height, 10) : null,
      fit: await select(
        "Fit strategy",
        ["inside", "outside", "cover", "contain", "fill"],
        config.resize?.fit ?? "inside",
      ),
      withoutEnlargement: await confirm("Prevent upscaling?", config.resize?.withoutEnlargement ?? true),
    }
  } else {
    config.resize = null
  }

  const savedPath = await saveConfig(config, { forceLocal })
  console.log()
  success(`Saved to ${savedPath}`)
  info(JSON.stringify(config, null, 2))
  console.log()

  close()
}
