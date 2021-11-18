const fs = require("fs");
const path = require("path");
const ts = require("typescript");
const { createMinifier } = require("dts-minify");

const minifier = createMinifier(ts);

const types = fs.readFileSync(path.join(__dirname, "../private/lib/bundled/index.d.ts"), "utf-8");

const minifiedTypes = minifier.minify(types);

fs.writeFileSync("./lib/index.d.ts", minifiedTypes);
