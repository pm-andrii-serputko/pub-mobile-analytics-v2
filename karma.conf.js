// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    // frameworks: ['mocha', 'chai', 'sinon-chai'],
    frameworks: ['mocha', 'chai', 'sinon-chai'],

    reporters: ['spec', 'coverage'],


    // generate js files from html templates+
    preprocessors: {
      'app/modules/**/*.html': 'ng-html2js',
      'app/modules/**/!(*.test)+(*.js)': ['coverage'],
      'app/domain/**/!(*.test)+(*.js)': ['coverage'],
      'app/dao/**/!(*.test)+(*.js)': ['coverage'],
      'app/common/config/**/!(*.test)+(*.js)': ['coverage'],
      'app/common/exceptions/**/!(*.test)+(*.js)': ['coverage'],
      'app/common/extensions/**/!(*.test)+(*.js)': ['coverage'],
      'app/common/validations/**/!(*.test)+(*.js)': ['coverage'],
      'app/common/common-module.js': ['coverage']
    },

    // needed if you have used the Yeoman's generator-angular or the app dir
    ngHtml2JsPreprocessor: {
      stripPrefix: 'app/',
    },

    coverageReporter: {
      reporters: [
        {type: 'html', dir:'coverage/'},
        {type: 'cobertura'},
        {type: 'text-summary'}
      ],
      watermarks: {
        statements: [ 50, 75 ],
        functions: [ 50, 75 ],
        branches: [ 50, 75 ],
        lines: [ 50, 75 ]
      }
    },


    // list of files / patterns to load in the browser
    files: [
      // application files
      "app/bower_components/angular/angular.js",
      "app/common/extensions/angular-copy.js",
      "app/bower_components/angular-mocks/angular-mocks.js",
      "app/bower_components/angular-resource/angular-resource.js",
      "app/bower_components/angular-route/angular-route.js",
      "app/bower_components/angular-animate/angular-animate.js",

      "app/bower_components/angular-foundation/mm-foundation-tpls.js",
      "app/bower_components/d3/d3.js",
      "app/bower_components/d3-tip/index.js",
      "app/bower_components/nvd3/nv.d3.js",
      "app/bower_components/moment/moment.js",
      "app/bower_components/angularjs-nvd3-directives/dist/angularjs-nvd3-directives.js",
      "app/bower_components/fastclick/lib/fastclick.js",
      "app/bower_components/angular-xeditable/dist/js/xeditable.js",
      "app/bower_components/isteven-angular-multiselect/angular-multi-select.js",
      "app/bower_components/angular-translate/angular-translate.js",
      "app/bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js",
      "app/bower_components/angular-base64/angular-base64.js",
      "app/bower_components/datepicker/angularjs/angular.datepicker.js",
      "app/bower_components/ngDialog/js/ngDialog.js",
      "app/bower_components/angular-poller/angular-poller.js",
      "app/bower_components/ng-idle/angular-idle.js",
      "app/bower_components/lodash/lodash.js",
      "app/bower_components/tophat-multiselect/multiselect.js",
      "app/bower_components/angular-toastr/dist/angular-toastr.js",
      
      "app/common/common-module.js",
      "app/common/extensions/object.js",
      "app/common/locales/currency-symbol.js",
      "app/common/**/*.js",
      "app/dao/module.js",
      "app/dao/**/*.js",
      "app/domain/domain-module.js",
      "app/domain/**/*.js",
      "app/modules/app-module.js",
      "app/modules/app-bootstrap.js",
      "app/modules/**/*.js",
      "app/modules/**/*.html",
      "app/public/*.js",

      // test libs
      "test/lib/ngMidwayTester.js",
      "test/lib/fn-bind.js",
      "app/bower_components/kickstartPmlComponents/app/components/pmlComponents/services/*.js",

      // test files
      "test/mocks/**/*.js",
      "test/spec/run.test.js",
      "app/modules/**/*.test.js",
      "test/spec/**/*.js",

      "http://s3.amazonaws.com/pubmatic-cc/latest/pmcc.js"
    ],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 9080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_ERROR,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    //browsers: ['Chrome'],
    // browsers: ['PhantomJS'],

    captureTimeout: 6000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    browserNoActivityTimeout: 100000
  });
};
