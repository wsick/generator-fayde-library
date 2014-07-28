var yeoman = require('yeoman-generator');

module.exports = yeoman.generators.Base.extend({
    constructor: function () {
        yeoman.generators.Base.apply(this, arguments);
    },
    prompting: {
        promptName: function () {
            var done = this.async();
            this.prompt({
                type: 'input',
                name: 'name',
                message: 'Your library name',
                default: this.appname // Default to current folder name
            }, function (answers) {
                this.name = this.appname;
                this.log(answers.name);
                done();
            }.bind(this));
        },
        promptModule: function () {
            var done = this.async();
            this.prompt({
                type: 'input',
                name: 'module_name',
                message: "Typescript module name",
                default: this.appname // Default to current folder name
            }, function (answers) {
                this.module_name = answers.module_name;
                this.log(answers.module_name);
                done();
            }.bind(this));
        }
    },
    configuring: {
        bowerSetup: function () {
            this.template('_bower.json', 'bower.json', this);
            this.copy('testsite/_bowerrc', 'testsite/.bowerrc');
            this.copy('testsite/_bower.json', 'testsite/bower.json');
        },
        gruntSetup: function () {
            this.copy('_package.json', 'package.json');
            this.copy('_Gruntfile.js', 'Gruntfile.js');
        }
    },
    writing: {
        buildFiles: function () {
            this.copy('build/utils/version.js', 'build/utils/version.js');
            this.copy('build/setup.js', 'build/setup.js');
            this.copy('build/version.js', 'build/version.js');
            this.template('build/_VersionTemplate._ts', 'build/_VersionTemplate._ts', this);
        },
        testsiteFiles: function () {
            this.template('testsite/_default.html', 'testsite/default.html', this);
            this.template('testsite/Views/_test1.fayde', 'testsite/Views/test1.fayde', this);
            this.copy('testsite/default.fap', 'testsite/default.fap');
            this.copy('testsite/require-config.js', 'testsite/require-config.js');
        }
    },
    install: {
        grunt: function () {
            this.npmInstall();
        }
    }
});