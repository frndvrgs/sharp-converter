import readline from "node:readline/promises"

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

const DIM = "\x1b[2m"
const BOLD = "\x1b[1m"
const GREEN = "\x1b[32m"
const YELLOW = "\x1b[33m"
const RESET = "\x1b[0m"

export async function ask(label, fallback) {
  const hint = fallback != null ? ` ${DIM}(${fallback})${RESET}` : ""
  const answer = (await rl.question(`  ${label}${hint}: `)).trim()
  return answer || (fallback != null ? String(fallback) : "")
}

export async function select(label, options, fallback) {
  console.log(`\n  ${BOLD}${label}${RESET}`)
  for (const [i, opt] of options.entries()) {
    const marker = opt === fallback ? `${GREEN}>${RESET}` : " "
    console.log(`  ${marker} ${i + 1}) ${opt}`)
  }
  const answer = (await rl.question(`  ${DIM}choice (1-${options.length})${RESET}: `)).trim()
  const idx = parseInt(answer, 10) - 1
  if (idx >= 0 && idx < options.length) return options[idx]
  return fallback ?? options[0]
}

export async function confirm(label, fallback = true) {
  const hint = fallback ? "Y/n" : "y/N"
  const answer = (await rl.question(`  ${label} ${DIM}(${hint})${RESET}: `)).trim().toLowerCase()
  if (!answer) return fallback
  return answer === "y" || answer === "yes"
}

export function info(msg) {
  console.log(`  ${DIM}${msg}${RESET}`)
}

export function success(msg) {
  console.log(`  ${GREEN}${msg}${RESET}`)
}

export function warn(msg) {
  console.log(`  ${YELLOW}${msg}${RESET}`)
}

export function heading(msg) {
  console.log(`\n  ${BOLD}${msg}${RESET}`)
}

export function close() {
  rl.close()
}
