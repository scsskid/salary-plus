module.exports = ctx => ({
  map: ctx.options.map,
  parser: ctx.options.parser,
  plugins: {
    'postcss-import': { root: ctx.file.dirname },
    'postcss-mixins': {},
    'postcss-size': {},
    'postcss-preset-env': {
      // browsers: 'last 2 versions',
      stage: 0, // 0: polyfill all, 4: polyfill none, but polyfill the following features: { 'nesting-rules': true}
      features: {
        'nesting-rules': true,
        'custom-selectors': true
      }
    },

    cssnano: ctx.env === 'production' ? {} : false
  }
})
