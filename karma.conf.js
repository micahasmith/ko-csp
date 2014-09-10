// karma.conf.js
module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],

    files: [
      './lib/*.js',
      './src/*.js',
      './spec/*.js'
    ]
  });
};