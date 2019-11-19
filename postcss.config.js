/* eslint-disable global-require */
module.exports = {
  plugins: [
    // @ts-ignore
    require('postcss-import'),
    // @ts-ignore
    require('postcss-preset-env')({
      features: {
        'nesting-rules': true,
      },
    }),
    require('autoprefixer'),
  ],
};
