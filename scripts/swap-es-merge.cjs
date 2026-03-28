const fs = require("fs")
const path = require("path")
const p = path.join(__dirname, "../lib/site-translations-data.ts")
let s = fs.readFileSync(p, "utf8")
const a = s.indexOf("\n  es: merge({")
const b = s.indexOf("\n  fr: merge({")
if (a < 0 || b < 0) throw new Error("markers not found")
s = s.slice(0, a) + "\n  es: merge(ES_FULL)," + s.slice(b)
if (!s.includes('import { ES_FULL }')) {
  s = `import { ES_FULL } from "./i18n/es-full"\n` + s
}
fs.writeFileSync(p, s)
console.log("ok")
