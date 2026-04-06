import fs from "node:fs/promises"
import { existsSync, mkdirSync } from "node:fs"
import path from "node:path"
import os from "node:os"

const LOCAL_CONFIG = ".sharpc.json"
const GLOBAL_CONFIG = path.join(os.homedir(), ".config", "sharp-converter", "sharpc.json")

const DEFAULTS = {
  format: "webp",
  quality: 80,
  resize: null,
}

function resolveConfigPath() {
  if (existsSync(LOCAL_CONFIG)) return LOCAL_CONFIG
  if (existsSync(GLOBAL_CONFIG)) return GLOBAL_CONFIG
  return null
}

function resolveConfigPathForWrite(forceLocal) {
  if (forceLocal || existsSync(LOCAL_CONFIG)) return LOCAL_CONFIG
  return GLOBAL_CONFIG
}

export async function loadConfig() {
  const configPath = resolveConfigPath()
  if (!configPath) return { ...DEFAULTS }
  try {
    const data = await fs.readFile(configPath, "utf8")
    return { ...DEFAULTS, ...JSON.parse(data) }
  } catch {
    return { ...DEFAULTS }
  }
}

export async function saveConfig(config, { forceLocal = false } = {}) {
  const configPath = resolveConfigPathForWrite(forceLocal)
  const dir = path.dirname(configPath)
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
  await fs.writeFile(configPath, JSON.stringify(config, null, 2) + "\n")
  return configPath
}

export { DEFAULTS, LOCAL_CONFIG, GLOBAL_CONFIG }
