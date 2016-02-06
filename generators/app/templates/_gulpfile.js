var gulp = require('gulp'),
    fs = require('fs'),
    taskListing = require('gulp-task-listing'),
    typings = require('bower-typings'),
    allTypings = typings(),
    name = '<%= name %>',
    meta = {
        name: name,
        getSrc: () => {
            return [
                'typings/*.d.ts',
                'src/_version.ts',
                'src/**/*.ts'
            ].concat(typings({includeSelf: false}))
        },
        getScaffold: (name) => {
            return meta.scaffolds.filter(function (scaffold) {
                return scaffold.name === name;
            })[0];
        },
        scaffolds: [
            {
                name: 'test',
                symdirs: ['dist', 'src', 'themes'],
                getSrc: () => {
                    return [
                        'typings/*.d.ts',
                        'test/**/*.ts',
                        '!test/lib/**/*.ts',
                        `dist/${name}.d.ts`
                    ].concat(allTypings);
                }
            },
            {
                name: 'testsite',
                ignore: 'lib/qunit',
                port: 8001,
                symdirs: ['dist', 'src', 'themes'],
                getSrc: () => {
                    return [
                        'typings/*.d.ts',
                        'testsite/**/*.ts',
                        '!testsite/lib/**/*.ts',
                        `dist/${name}.d.ts`
                    ].concat(allTypings);
                }
            }
        ]
    };

gulp.task('help', taskListing);

fs.readdirSync('./gulp')
    .forEach(function (file) {
        require('./gulp/' + file)(meta);
    });
