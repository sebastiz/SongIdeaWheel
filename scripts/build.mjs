// Builds index.html (pre-compiled, fast-loading) from src/progression-wheel.jsx
import { build } from "esbuild";
import { readFileSync, writeFileSync } from "fs";

let src = readFileSync("src/progression-wheel.jsx", "utf8");
src = src.replace('import { useState, useMemo, useRef, useEffect } from "react";',
                  "const { useState, useMemo, useRef, useEffect } = React;");
src = src.replace("export default function ProgressionWheel()", "function ProgressionWheel()");
src += '\nReactDOM.createRoot(document.getElementById("root")).render(React.createElement(ProgressionWheel));\n';
writeFileSync("scripts/.app.jsx", src);

await build({ entryPoints: ["scripts/.app.jsx"], outfile: "scripts/.app.min.js",
  loader: { ".jsx": "jsx" }, jsx: "transform", minify: true, target: "es2018" });

const js = readFileSync("scripts/.app.min.js", "utf8");
const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>The Progression Wheel</title>
<style>html,body{margin:0;background:#10151D}#boot{color:#8B94A3;font-family:system-ui;padding:40px;text-align:center}</style>
</head>
<body>
<div id="root"><div id="boot">Tuning up…</div></div>
<script crossorigin src="https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js"></script>
<script crossorigin src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js"></script>
<script>
${js}
</script>
</body>
</html>`;
writeFileSync("index.html", html);
console.log("built index.html");
