const gulp = require('gulp'),
browserSync = require('browser-sync');

const rollup = require('gulp-better-rollup');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
var clean = require('gulp-clean');

const eslint = require('gulp-eslint');





const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
var include            = require('gulp-include');
var reload      = browserSync.reload;
var notify             = require("gulp-notify");
const { src } = require('gulp');


var srcPath            = './src/';            // Path to the source files

// var baseballPath = './node_modueles/baseball-pitchfx-3d';
var nodePath = './node_modules/';


// Paths that gulp should watch
var watchPaths        = {
    scripts:     [
        srcPath+'assets/js/*.js',
        srcPath+'assets/js/**/*.js'
    ],
    images:     [
        srcPath+'assets/img/**'
    ],
    sass:         [
        srcPath+'assets/sass/*.scss',
        srcPath+'assets/sass/**/*.scss'
    ],
    fonts:      [
        srcPath+'assets/fonts/**'
    ],
    html:          [
        srcPath+'**/*.html',
        srcPath+'**/*.php'
    ]
   
    
};

var bases = {
  app: 'src/',
  dist: 'dist/'
};

var paths = {

  html:['**/*.html'],
  scripts:['**/*.js', '/.*'],
  styles:['**/*.scss'],
  libs: ['scripts/libs/jquery/jquery-1.7.2.min.js', 'scripts/libs/d3/intro.js'],
  media: ['media/**/*.{gif,png,jpg,svg}'],
  // baseball: ['./node_modules/baseball-pitchfx-3d/']
  
  

}




gulp.task('clean', function() {
  return gulp.src(bases.dist, {allowEmpty: true})
  .pipe(clean())

 });
 
 gulp.task('scripts', gulp.series( function() {
  return gulp.src(paths.scripts, {cwd: bases.app})
  // .pipe(rollup({ plugins: [resolve(), commonjs()]}, 'umd'))
  
  // console.log( {cwd: bases.app} + 'scripts/')
  .pipe(gulp.dest(bases.dist));
 }));



 
gulp.task('copy', gulp.series('clean', 'scripts', function() {
 // Copy html
  gulp.src(paths.html, {cwd: bases.app})
 .pipe(gulp.dest(bases.dist));

  // Copy styles
   gulp.src(paths.styles, {cwd: bases.app})
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest(bases.dist));

 // Copy lib scripts, maintaining the original directory structure
  return gulp.src(paths.libs, {allowEmpty: true}, {cwd: bases.dist})
 .pipe(gulp.dest(bases.dist))
 
 
}));




exports.scripts = function (done) {
  gulp.src('source/js/entry.js')
    .pipe(include())
      .on('error', console.log)
    .pipe(gulp.dest('dist/js'))
}

function runLinter(cb) {
  return src(['**/*.js', '!node_modules/**'])
      .pipe(eslint())
      .pipe(eslint.format()) 
      .pipe(eslint.failAfterError())
      .on('end', function() {
          cb();
      });
}

exports.lint = runLinter;




// Logs Message
gulp.task('message', function(done){
  console.log('Gulp is running...');
  done();

});

// Copy All HTML files
gulp.task('copyHTML', function(){
    return gulp.src('/src/assets/html/**/*.html')
        .pipe(gulp.dest(distPath + '/html'));
  });

// Optimize Images
gulp.task('imageMin', () =>
	gulp.src('src/assets/media/**/*.png')
		.pipe(imagemin())
		.pipe(gulp.dest(bases.dist +'assets/media/'))
);

// Minify JS
gulp.task('minify', function(){
    return gulp.src('src/js/*.js')
      .pipe(uglify())
      .pipe(gulp.dest('dist/assets/scripts'));
});

// Compile Sass

function style(){
  return gulp.src(paths.styles, {cwd: bases.app})
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(bases.dist))
    // .pipe(browserSync.stream());
}

function copyHTML(){

  return gulp.src(paths.html, {cwd: bases.app})
  .pipe(gulp.dest(bases.dist));

}
function copyScripts(){

  return gulp.src(paths.scripts, {cwd: bases.app})
  .pipe(gulp.dest(bases.dist));

}



gulp.task('style', function(){
    return gulp.src(paths.styles, {cwd: bases.app})
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest(bases.dist))
      .pipe(browserSync.stream());
});


gulp.task ('nodeLoad', function() {
    return gulp.src('node_modules/*.js')
    .pipe(gulp.dest(distPath + '/html'));
})
// Scripts
// gulp.task('scripts', function(){
//     return gulp.src('src/js/*.js')
//       .pipe(concat('main.js'))
//       .pipe(uglify())
//       .pipe(gulp.dest('dist/common/js'));
// });

gulp.task('watch', function watch(){
  var files = [
    'dist/**/*.html',
    'dist/assets/css/**/*.css',
    'dist/assets/media/images/**/*.png',
    'dist/assets/js/**/*.js',
    './src/assets/**/*.html',
    './src/assets/scripts/**/*.js'
    
  ];
  browserSync.init(files,{
    server: {
      baseDir: './dist/'
    }
  });
  gulp.watch('./src/assets/styles/**/*.scss', style).on('change',browserSync.reload);
  gulp.watch('./src/**/*.html', copyHTML).on('change', browserSync.reload);
  gulp.watch('./src/**/*.js', copyScripts).on('change', browserSync.reload);
  

});



gulp.task('default', gulp.parallel('message','clean', 'copy',  'imageMin',  'watch' ), function(){
    // return ['message', 'copyHtml', 'imageMin', 'sass', 'scripts']
    });
    


// gulp.task('watch', gulp.('copyHTML', 'imageMin', 'sass', 'scripts')), function(){
//   gulp.watch('src/js/*.js', ['scripts']);
//   gulp.watch('src/images/*', ['imageMin']);
//   gulp.watch('src/sass/*.scss', ['sass']);
//   gulp.watch('src/*.html', ['copyHTML']);
// };
