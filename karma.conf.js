module.exports = function(config) {
    config.set({
      basePath: '',
      frameworks: ['jasmine', '@angular-devkit/build-angular'],
      files: [
        'src/test.ts',
        'src/**/*.spec.ts'
      ],
      exclude: [],
      preprocessors: {
        'src/test.ts': ['@angular-devkit/build-angular'],
      },
      reporters: ['progress', 'kjhtml'],
      port: 9876,
      colors: true,
      logLevel: config.LOG_INFO,
      autoWatch: true,
      browsers: ['Chrome'],
      singleRun: false,
      concurrency: Infinity,
      plugins: [
        'karma-jasmine',
        'karma-chrome-launcher',
        'karma-jasmine-html-reporter',
        '@angular-devkit/build-angular',
      ],
      jasmineHtmlReporter: {
        suppressAll: true
      }
    });
  };
  