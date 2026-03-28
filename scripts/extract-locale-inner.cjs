const fs = require("fs")
const path = require("path")
const s = fs.readFileSync(path.join(__dirname, "../lib/site-translations-data.ts"), "utf8")
const label = process.argv[2] || "es"
const needle = `${label}: merge(`
const start = s.indexOf(needle)
if (start < 0) {
  console.error("not found", label)
  process.exit(1)
}
const brace = s.indexOf("{", start)
let depth = 0
let i = brace
for (; i < s.length; i++) {
  const c = s[i]
  if (c === "{") depth++
  else if (c === "}") {
    depth--
    if (depth === 0) break
  }
}
const inner = s.slice(brace, i + 1)
const out = path.join(__dirname, "../lib/_extracted-" + label + ".txt")
fs.writeFileSync(out, inner)
console.log("wrote", out, inner.length)
