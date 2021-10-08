/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
module.exports = {
  plugins: [
    require('postcss-pxtorem')({
      rootValue: 37.5,
      propList: ['*'],
    }),
  ],
}
