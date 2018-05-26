import typescript from 'rollup-plugin-typescript';
import visualizer from 'rollup-plugin-visualizer';
//import resolve from 'rollup-plugin-node-resolve';
//import commonjs from 'rollup-plugin-commonjs';

export default {
  input: './main.ts',
  output: {
      format: "cjs",
      dir: "./dist",
      file: "./dist/minimal.js",
  },
  plugins: [
    typescript({
        typescript: require('typescript')
    }),
    //resolve(),
    //commonjs(),
    visualizer()
]
}