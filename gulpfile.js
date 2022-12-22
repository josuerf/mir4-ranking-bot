const {src, dest} = require('gulp')
const uglify = require('gulp-uglify')

exports.default = () => {
    return src('src/**/*.js')
        .pipe(uglify({ mangle: { eval: true, toplevel: true, properties: false, keep_fnames: true } }))
        .pipe(dest('dist/js/'))
}
