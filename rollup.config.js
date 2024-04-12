const resolve = require("@rollup/plugin-node-resolve");
const terser = require("@rollup/plugin-terser");
const commonjs = require("@rollup/plugin-commonjs");

module.exports = {
  input: "lib/index.js",
  plugins: [
    resolve({ browser: true, preferBuiltins: false }),
    commonjs(),
    terser(),
  ],
  output: {
    file: `dist/tools.js`,
    format: "iife",
    name: "tools",
    sourcemap: true,
  },
};
