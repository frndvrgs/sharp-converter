import fs from "node:fs/promises"
import path from "node:path"

const CONFIG_FILE = ".sharpc.json"

const DEFAULTS = {
  format: "webp",
  quality: 80,
  resize: null,
}

export async function loadConfig(cwd = process.cwd()) {
  const configPath = path.join(cwd, CONFIG_FILE)
  try {
    const data = await fs.readFile(configPath, "utf8")
    return { ...DEFAULTS, ...JSON.parse(data) }
  } catch {
    return { ...DEFAULTS }
  }
}

export async function saveConfig(config, cwd = process.cwd()) {
  const configPath = path.join(cwd, CONFIG_FILE)
  await fs.writeFile(configPath, JSON.stringify(config, null, 2) + "\n")
}

export { DEFAULTS, CONFIG_FILE }
