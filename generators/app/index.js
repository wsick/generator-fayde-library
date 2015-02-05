var yeoman = require('yeoman-generator'),
    unify = require('fayde-unify');

module.exports = yeoman.generators.Base.extend({
    constructor: function () {
        yeoman.generators.Base.apply(this, arguments);

        this.on('end', function () {
            this.installDependencies({
                skipInstall: this.options['skip-install'],
                callback: function () {
                    var cmd = this.spawnCommand('grunt', ['symlink:test', 'symlink:testsite']);
                    cmd.on('close', function (code) {
                        if (code !== 0) {
                            console.log('Could not set up symbolic links for library.  Run `grunt lib:reset` as admin to complete.');
                        }
                    });
                }.bind(this)
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
                message: "Typescript default namespace",
                default: this.appname // Default to current folder name
            }, function (answers) {
                this.module_name = answers.module_name;
                //this.log(answers.module_name);
                done();
            }.bind(this));
        },
        promptThemes: function () {
            var done = this.async();
            this.prompt({
                type: 'confirm',
                name: 'has_themes',
                message: 'Does library have XAML themes?'
            }, function (answers) {
                this.has_themes = answers.has_themes;
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
        unifyGlobal: function () {
            var done = this.async();
            var proc = this.spawnCommand('npm install -g fayde-unify');
            proc.on('close', function (code) {
                if (code !== 0) {
                    console.log("Could not globally install fayde-unify. Try running `npm install -g fayde-unify`.");
                    done(code);
                    return;
                }
                done();
            });
        }
    },
    writing: {
        buildFiles: function () {
            this.mkdir('src');
            this.copy('_travis.yml', 'travis.yml');
        },
        distFiles: function () {
            this.copy('dist/_.js', 'dist/' + this.name + '.js');
            this.copy('dist/_.js.map', 'dist/' + this.name + '.js.map');
            this.copy('dist/_.d.ts', 'dist/' + this.name + '.d.ts');
        },
        themeFiles: function () {
            if (this.has_themes)
                this.template('themes/_Metro.theme.xml', 'themes/Metro.theme.xml', this);
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
        unify: function () {
            var done = this.async();
            var dist = 'dist/' + this.name;
            unify.commands.init({
                name: this.name,
                type: 'lib',
                tests: [
                    {
                        "file": "test/fayde.json",
                        "lib": "test/lib"
                    },
                    {
                        "file": "testsite/fayde.json",
                        "lib": "testsite/lib",
                        "exclude": ["qunit"]
                    }
                ],
                dist: dist,
                library: {
                    type: 'export',
                    exports: this.module_name
                },
                themes: this.has_themes ? {} : "none",
                typings: [dist + '.d.ts']
            }, done);
        },
        unifyBower: function () {
            var done = this.async();
            unify.commands.bower({}, done);
        },
        bower: function () {
            var done = this.async();
            this.bowerInstall(['fayde'], {save: true}, done);
        },
        bowerDev: function () {
            var done = this.async();
            this.bowerInstall(['qunit'], {saveDev: true}, done);
        }
    }
});