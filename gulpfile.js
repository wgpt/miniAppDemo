// 获取 gulp
const gulp = require('gulp')
// 获取 gulp-stylus 模块
const rename = require('gulp-rename')
const stylus = require('gulp-stylus')

// 编译gulp-stylus
const sass_dir = 'pages/**/*.styl'
gulp.task('stylus-go', function() {
    return gulp.src(sass_dir)
        .pipe(stylus())
        .on('error', function (error) {

            console.error(error.toString())
            this.emit('end')

        })
        .pipe(rename({
            extname: ".wxss"
        }))

        .pipe(gulp.dest('pages'))
});

// 在命令行使用 gulp auto 启动此任务
gulp.task('stylus-run', function () {
    // 监听文件修改，当文件被修改则执行 images 任务
    gulp.watch(sass_dir, ['stylus-go'])
});
