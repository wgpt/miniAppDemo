// 获取 gulp
const {src, dest, watch} = require('gulp')
// 获取 gulp-stylus 模块
const rename = require('gulp-rename')
const stylus = require('gulp-stylus')

// 编译gulp-stylus
const sass_dir = 'pages/**/*.styl'

function go() {
    return src(sass_dir)
        .pipe(stylus())
        .on('error', function (error) {
            console.error(error.toString())
            this.emit('end')
        })
        .pipe(rename({
            extname: ".wxss"
        }))
        .pipe(dest('pages'))
}

exports.go = go

// 在命令行使用 gulp go 启动此任务
watch(sass_dir, go)
