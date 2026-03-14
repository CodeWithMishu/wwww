const fs = require("fs");
const path = require("path");

const target = path.join(
  __dirname,
  "..",
  "node_modules",
  "@expo",
  "cli",
  "build",
  "src",
  "start",
  "server",
  "metro",
  "externals.js"
);

if (!fs.existsSync(target)) {
  process.exit(0);
}

const source = fs.readFileSync(target, "utf8");
if (source.includes("includes(\":\")")) {
  process.exit(0);
}

const updated = source.replace(
  "].sort();",
  '].filter((x)=>!x.includes(":")).sort();'
);

if (updated === source) {
  process.exit(0);
}

fs.writeFileSync(target, updated, "utf8");
console.log("Patched @expo/cli externals to avoid Windows colon paths.");
