// import fs from 'fs-extra'
import path from 'path'
import nodeResolvePlugin from '@rollup/plugin-node-resolve'
// import babelPlugin from '@rollup/plugin-babel'
// import commonjsPlugin from '@rollup/plugin-commonjs'
// import jsonPlugin from '@rollup/plugin-json'
// import aliasPlugin from '@rollup/plugin-alias'

import packageJson from '../package.json'

const resolve = (dir) => {
  return path.resolve(__dirname, '..', 'packages', dir)
}

export default {
  input: {
    cli: resolve('cli'),
    core: resolve('core'),
    index: resolve('index'),
  },
  output: {
    dir: 'lib',
    format: 'cjs',
    exports: 'auto',
    hoistTransitiveImports: false,
    chunkFileNames: '[name].js',
    manualChunks: {
      builder: [resolve('builder')],
      compiler: [resolve('compiler')],
      config: [resolve('config')],
      resolver: [resolve('resolver')],
      tuxt: [resolve('tuxt')],
      utils: [resolve('utils')],
      webpack: [resolve('webpack')],
    },
  },
  plugins: [
    nodeResolvePlugin(),
    // babelPlugin({
    //   babelHelpers: 'bundled',
    // }),
  ],
  external: Object.keys(packageJson.dependencies),
}