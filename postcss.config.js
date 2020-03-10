module.exports = ctx => ({
  map: ctx.options.map,
  parser: ctx.options.parser,
  plugins: {
    'postcss-import': { root: ctx.file.dirname },
    'postcss-preset-env': {
      stage: 4 // 0: polyfill all, 4: polyfill none, but [features: { 'nesting-rules': true}]
    },
    cssnano: ctx.env === 'production' ? {} : false
  }
})
