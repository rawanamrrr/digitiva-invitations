import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const p = path.join(__dirname, "../lib/site-translations-data.ts")
const s = fs.readFileSync(p, "utf8")
const j = s.indexOf("\n}\n\n/** Merge")
const i = s.indexOf("export const EN:")
const brace = s.indexOf("{", i)
const body = s.slice(brace + 1, j)
const keys = [...body.matchAll(/\n  "([^"]+)":/g)].map((x) => x[1])
console.log("count", keys.length)
const out = path.join(__dirname, "../lib/_en-keys.json")
fs.writeFileSync(out, JSON.stringify(keys, null, 2))
console.log("wrote", out)
