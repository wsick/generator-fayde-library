var yeoman = require('yeoman-generator');

module.exports = yeoman.generators.Base.extend({
    constructor: function () {
        yeoman.generators.Base.apply(this, arguments);

        this.on('end', function () {
            this.installDependencies({
                skipInstall: this.options['skip-install'],
                callback: function () {
                    this.spawnCommand('grunt', ['symlink:test', 'symlink:testsite']);
                }.bind(this) // bind the callback to the parent scope
            });
        });
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
                this.name = answers.name;
                //this.log(answers.name);
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
                //this.log(answers.module_name);
                done();
            }.bind(this));
        }
    },
    configuring: {
        bowerSetup: function () {
            this.template('_bower.json', 'bower.json', this);
            this.copy('_bowerrc', '.bowerrc');
        },
        gruntSetup: function () {
            this.copy('_package.json', 'package.json');
            this.template('_Gruntfile.js', 'Gruntfile.js', this);
        },
        faydeSetup: function () {
            this.template('test/_fayde.json', 'test/fayde.json', this);
            this.template('testsite/_fayde.json', 'testsite/fayde.json', this);
        }
    },
    writing: {
        buildFiles: function () {
            this.copy('build/utils/version.js', 'build/utils/version.js');
            this.copy('build/setup.js', 'build/setup.js');
            this.copy('build/version.js', 'build/version.js');
            this.template('build/_VersionTemplate._ts', 'build/_VersionTemplate._ts', this);
            this.mkdir('src');
        },
        distFiles: function () {
            this.copy('dist/_.js', 'dist/' + this.name + '.js');
            this.copy('dist/_.js.map', 'dist/' + this.name + '.js.map');
            this.copy('dist/_.d.ts', 'dist/' + this.name + '.d.ts');
        },
        themeFiles: function () {
            this.template('Themes/_Metro.theme.xml', 'Themes/Metro.theme.xml', this);
        },
        testfiles: function () {
            this.template('test/_runner.ts', 'test/runner.ts', this);
            this.copy('test/tests.html', 'test/tests.html');
            this.copy('test/tests/test1.ts', 'test/tests/test1.ts');
        },
        testsiteFiles: function () {
            this.copy('testsite/default.html', 'testsite/default.html');
            this.copy('testsite/default.fap', 'testsite/default.fap');
            this.template('testsite/Views/_test1.fayde', 'testsite/Views/test1.fayde', this);
        },
        typingsFiles: function () {
            this.copy('typings/qunit.d.ts', 'typings/qunit.d.ts');
            this.copy('typings/require.d.ts', 'typings/require.d.ts');
        }
    },
    install: {
        grunt: function () {
            this.npmInstall();
            this.bowerInstall();
        }
    }
});