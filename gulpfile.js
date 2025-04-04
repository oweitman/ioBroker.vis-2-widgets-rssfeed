/*!
 * ioBroker gulpfile
 * Date: 2023-03-22
 */
'use strict';

const gulp = require('gulp');
const fs = require('fs');
const adapterName = require('./package.json').name.replace('iobroker.', '');
const gulpHelper = require('@iobroker/vis-2-widgets-react-dev/gulpHelper');

const SRC = 'src-widgets/';
const src = `${__dirname}/${SRC}`;

gulp.task('widget-0-clean', done => {
    gulpHelper.deleteFoldersRecursive(`${src}build`);
    gulpHelper.deleteFoldersRecursive(`${__dirname}/widgets`);
    done();
});
gulp.task('widget-1-npm', async () => gulpHelper.npmInstall(src));

gulp.task('widget-2-compile', async () => gulpHelper.buildWidgets(__dirname, src));

gulp.task('widget-3-copy', () => Promise.all([
    gulp.src([`${SRC}build/custom*.js`]).pipe(gulp.dest(`widgets/${adapterName}`)),
    gulp.src([`${SRC}build/img/*`]).pipe(gulp.dest(`widgets/${adapterName}/img`)),
    gulp.src([`${SRC}build/custom*.map`]).pipe(gulp.dest(`widgets/${adapterName}`)),
    gulp.src([
        `${SRC}build/static/**/*`,
        ...gulpHelper.ignoreFiles(SRC),
        ...gulpHelper.ignoreSvgFiles(SRC),
    ]).pipe(gulp.dest(`widgets/${adapterName}/static`)),
    gulp.src([
        ...gulpHelper.copyFiles(SRC),
        ...[
            `${SRC}build/static/js/*ace*.*`,
            `${SRC}build/static/js/*useTheme*.*`,
            `${SRC}build/static/js/*common_js*.*`,
            `${SRC}build/static/js/*dist_clsx_mjs*.*`,
        ],
        ...[`!${SRC}build/static/js/*.xmap`, `!${SRC}build/static/js/*.txt`],
    ]).pipe(gulp.dest(`widgets/${adapterName}/static/js`)),
    gulp.src([`${SRC}src/i18n/*.json`]).pipe(gulp.dest(`widgets/${adapterName}/i18n`)),
    new Promise(resolve =>
        setTimeout(() => {
            if (fs.existsSync(`widgets/${adapterName}/static/media`) &&
                !fs.readdirSync(`widgets/${adapterName}/static/media`).length
            ) {
                fs.rmdirSync(`widgets/${adapterName}/static/media`)
            }
            resolve();
        }, 500)
    )
]));

gulp.task('widget-build', gulp.series(['widget-0-clean', 'widget-1-npm', 'widget-2-compile', 'widget-3-copy']));

gulp.task('default', gulp.series('widget-build'));

