//   - This file is part of Memento Extension
//  <https://github.com/gerwld/Memento-extension/blob/main/README.md>,
//   - Copyright (C) 2023-present Memento Extension
//   -
//   - Memento Extension is a software: you can redistribute it, but you are not allowed to modify it under the terms of the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0) License.
//   -
//   - Memento Extension is distributed in the hope that it will be useful,
//   - but WITHOUT ANY WARRANTY; without even the implied warranty of
//   - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//   - Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0) License for more details.
//   -
//   - You should have received a copy of the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0) License
//   - along with Memento Extension.  If not, see <https://creativecommons.org/licenses/by-nc-nd/4.0/>.





import gulp from 'gulp';
import babel from 'gulp-babel';
import svgmin from 'gulp-svgmin';
import autoprefix from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import imagemin from 'gulp-imagemin';
import gulpFlatten from 'gulp-flatten';
import insert from 'gulp-insert';
import uglify from 'gulp-uglify';
import htmlmin from "gulp-htmlmin";
import rename from "gulp-rename";
import concat from "gulp-concat";
import filter from 'gulp-filter';
import replace from "gulp-replace";
import zip from 'gulp-zip';
import chalk from 'chalk';
import path from 'path';
import flatmap from 'gulp-flatmap';
import fileinclude from "gulp-file-include";


let { src, dest, task, series } = gulp;
const link = chalk.hex('#5e98d9');
const EXTENSION_NAME = 'memento'
const EXTENSION_V = 'v.1.5.0'
const COPYRIGHT = `//   - This file is part of Memento Extension
//  <https://github.com/gerwld/Memento-extension/blob/main/README.md>,
//   - Copyright (C) 2023-present Memento Extension
//   -
//   - Memento Extension is a software: you can redistribute it, but you are not allowed to modify it under the terms of the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0) License.
//   -
//   - Memento Extension is distributed in the hope that it will be useful,
//   - but WITHOUT ANY WARRANTY; without even the implied warranty of
//   - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//   - Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0) License for more details.
//   -
//   - You should have received a copy of the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0) License
//   - along with Memento Extension.  If not, see <https://creativecommons.org/licenses/by-nc-nd/4.0/>.



`

//## Minify Images  ##//
task('minifyImg', async function () {
    src(['./src/assets/img/*.svg', './src/assets/img/**/*.svg'])
        .pipe(svgmin())
        .pipe(gulpFlatten({ includeParents: 4 }))
        .pipe(dest('./dist/chromium/assets/img/'))
        .pipe(dest('./dist/firefox/assets/img/'))

    src(['./src/assets/img/*.png', './src/assets/img/*.gif',  './src/assets/img/**/*.png'])
        // .pipe(imagemin())
        .pipe(gulpFlatten({ includeParents: 4 }))
        .pipe(dest('./dist/chromium/assets/img/'))
        .pipe(dest('./dist/firefox/assets/img/'))

    src(['./src/assets/icons/*.png', './src/assets/icons/**/*.png'])
        // .pipe(imagemin())
        .pipe(gulpFlatten({ includeParents: 4 }))
        .pipe(dest('./dist/chromium/assets/icons/'))
        .pipe(dest('./dist/firefox/assets/icons/'))

    src(['./src/assets/img/**/*.md'])
        .pipe(gulpFlatten({ includeParents: 4 }))
        .pipe(dest('./dist/chromium/assets/img/'))
        .pipe(dest('./dist/firefox/assets/img/'))
});

//## Minify CSS  ##//
task('minifyCSS', async function () {
    src(['./src/assets/styles/*.css', './src/assets/styles/**/*.css', './src/assets/styles/**/**/*.css', './src/assets/scripts/features/toolbar/**/*.css'])
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(autoprefix('last 2 versions'))
        .pipe(insert.prepend(`/*\n${COPYRIGHT}*/\n\n`))
        .pipe(gulpFlatten({ includeParents: 4 }))
        .pipe(dest('./dist/firefox/assets/styles/'))

    src(['./src/assets/styles/*.css', './src/assets/styles/**/*.css', './src/assets/styles/**/**/*.css', './src/assets/scripts/features/toolbar/**/*.css'])
        .pipe(replace('moz-extension://', 'chrome-extension://'))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(autoprefix('last 2 versions'))
        .pipe(insert.prepend(`/*\n${COPYRIGHT}*/\n\n`))
        .pipe(gulpFlatten({ includeParents: 4 }))
        .pipe(dest('./dist/chromium/assets/styles/'))
});

//## Minify JS ##//
task('minifyJS', async function () {
    return src('./src/assets/scripts/**/*.js') // Include all JS files recursively
        .pipe(flatmap(function (stream, file) {
            // Calculate the relative directory once
            const relativePath = path.relative('./src/assets/scripts', file.base);
            return stream
                .pipe(uglify())
                .pipe(insert.prepend(COPYRIGHT))
                .pipe(dest(`./dist/chromium/assets/scripts/${relativePath}`))
                .pipe(dest(`./dist/firefox/assets/scripts/${relativePath}`));
        }));
});

//## Dev JS ##//
task('devJS', async function () {
    return src('./src/assets/scripts/**/*.js') // Include all JS files recursively
        .pipe(flatmap(function (stream, file) {
            // Calculate the relative directory once
            const relativePath = path.relative('./src/assets/scripts', file.base);
            return stream
                .pipe(dest(`./dist/chromium/assets/scripts/${relativePath}`))
                .pipe(dest(`./dist/firefox/assets/scripts/${relativePath}`));
        }));
});

//## Minify HTML ##//
task('minifyHTML', async function () {
    src(['./src/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: './src/assets'
        }))
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(insert.prepend(`<!--\n${COPYRIGHT}-->\n\n`))
        .pipe(gulpFlatten({ includeParents: 4 }))
        .pipe(dest('./dist/chromium/'))
        .pipe(dest('./dist/firefox/'))
});


//## Add other files  ##//
task('addOther', async function () {
    src(['./LICENSE', './package.json', './README.md', './SECURITY.md'])
        .pipe(dest('./dist/chromium'))
        .pipe(dest('./dist/firefox'));

    src('./src/manifests/chromium.json').pipe(rename("manifest.json")).pipe(dest('./dist/chromium'));
    src('./src/manifests/firefox.json').pipe(rename("manifest.json")).pipe(dest('./dist/firefox'));

    src(['./_locales/**/*'])
        .pipe(dest('./dist/chromium/_locales'))
        .pipe(dest('./dist/firefox/_locales'))
});

//## Minify JSON ##//
task('minifyJSON', async function () {
    src(['./src/services/*.json'])
        // TODO 
        .pipe(gulpFlatten({ includeParents: 4 }))
        .pipe(dest('./dist/chromium/services/'))
        .pipe(dest('./dist/firefox/services/'))
});

//## For source code .zip ##//
task('source', async function (done) {
    const excludedDirs = ['dist', 'node_modules', 'previews', '.git'];
    const excludedFiles = ['**', '!**/__*.js', '!**/*.zip', '.git', '.gitignore', '.DS_Store', "!**/manifest.json", "!**/pnpm-lock.yaml"];

    src("./**/*")
        .pipe(filter(['**', ...excludedFiles]))
        .pipe(filter(['**', ...excludedDirs.map(e => [`!./${e}/**/*`, `!./${e}/`]).flat(2)]))
        .pipe(dest('./dist/__source_code/'))

    src("./**/*")
        .pipe(filter(['**', ...excludedFiles]))
        .pipe(filter(['**', ...excludedDirs.map(e => [`!./${e}/**/*`, `!./${e}/`]).flat(2)]))
        .pipe(zip(`${EXTENSION_NAME}_${EXTENSION_V}_source_code.zip`))
        .pipe(gulp.dest('./dist/'))
        .on('end', function () {
            console.log("Source finished, dest: " + link(`./dist/${EXTENSION_NAME}_${EXTENSION_V}_source_code.zip`));
            done();
        })
});


task('zipper', async function (done) {
    setTimeout(function () {
        const fn_base = `${EXTENSION_NAME}_${EXTENSION_V}`
        console.log(chalk.green("Zipper started."));
        src("./dist/firefox/**/*")
            .pipe(zip(`${fn_base}_firefox.zip`))
            .pipe(gulp.dest('./dist/'))
            .on('end', function () {
                console.log("Zipper finished, dest: " + link(`./dist/${fn_base}_firefox.zip`));
                done();
            });
        src("./dist/chromium/**/*")
            .pipe(zip(`${fn_base}_chromium.zip`))
            .pipe(gulp.dest('./dist/'))
            .on('end', function () {
                console.log("Zipper finished, dest: " + link(`./dist/${fn_base}_chromium.zip`));
                done();
            });
    }, 6000);
});

// Watcher task to monitor changes in the src directory and run the build task
task('watch', function () {
    console.clear();
    console.log("Dev mode initialized.\n" + chalk.green(`${EXTENSION_NAME} - ${EXTENSION_V}\n`));
    console.log(chalk.green("✓") + " Starting...\n" + chalk.green("✓") + " Started sucessfuly.\n");

    console.log("\nBuild files located in " + chalk.hex("#205ab3")("./dist/$browsertype") + " directory.\n\n");

    gulp.watch('./src/**/*', series('build')).on('change', function (path, stats) {
        console.clear();
        console.log(`File ${link("./" + path)} was changed, running build...`);
    });
});

// Watcher task to monitor changes in the src directory and run the build task
task('watch_dev', function () {
    console.clear();
    console.log("Dev mode initialized.\n" + chalk.green(`${EXTENSION_NAME} - ${EXTENSION_V}\n`));
    console.log(chalk.green("✓") + " Starting...\n" + chalk.green("✓") + " Started sucessfuly.\n");

    console.log("\nBuild files located in " + chalk.hex("#205ab3")("./dist/$browsertype") + " directory.\n\n");

    gulp.watch('./src/**/*', series('build_dev')).on('change', function (path, stats) {
        console.clear();
        console.log(`File ${link("./" + path)} was changed, running build...`);
    });
});

task('build', series('minifyImg', "minifyCSS", "minifyJS", "minifyJSON", "minifyHTML", "addOther"));
task('build_dev', series('minifyImg', "minifyCSS", "devJS", "minifyJSON", "minifyHTML", "addOther"));
task('build_md', series('minifyImg', "minifyCSS", "minifyJS", "minifyJSON", "minifyHTML", "addOther", "source", "zipper"));

// Task to run the build and start the watcher
task('dev', series('build_dev', 'watch_dev'));
// TODO: Faster Dev builds
task('edge', series('build_dev', 'watch_dev'));
task('firefox', series('build_dev', 'watch_dev'));
task('chrome', series('build_dev', 'watch_dev'));


task('default', series('build'));
