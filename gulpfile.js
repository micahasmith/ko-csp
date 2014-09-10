var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var header = require('gulp-header');
var packageJson = require('./package.json');


gulp.task('clean',function(){
	return gulp.src('build/')
		.pipe(clean());
});

gulp.task('compress', function() {
var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n')


  gulp.src(['src/ko.sub*.js','src/ko-csp*.js'])
    .pipe(uglify())
  	.pipe(concat('build/ko-csp.'+packageJson.version+'.js'))
  	.pipe(header(banner ,{pkg:packageJson}))
    .pipe(gulp.dest('./'))
});

gulp.task('defualt',['clean','compress']);