const fs = require("fs")
const path = require("path")
const p = path.join(__dirname, "../lib/site-translations-data.ts")
let s = fs.readFileSync(p, "utf8")
const a = s.indexOf("\n  fr: merge({")
const b = s.indexOf("\n  de: merge({")
if (a < 0 || b < 0) throw new Error("markers not found")
s = s.slice(0, a) + "\n  fr: merge(FR_FULL)," + s.slice(b)
if (!s.includes('import { FR_FULL }')) {
  s = s.replace(
    `import { ES_FULL } from "./i18n/es-full"`,
    `import { ES_FULL } from "./i18n/es-full"\nimport { FR_FULL } from "./i18n/fr-full"`,
  )
}
fs.writeFileSync(p, s)
console.log("ok")
