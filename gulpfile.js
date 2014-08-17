var gulp= require('gulp'),
	connect=require('gulp-connect'),
	historyApiFallback=require('connect-history-api-fallback');


// servidor web de desarrollo

gulp.task('server',function () {
	connect.server({
		root:'./app',
		hostname:'0.0.0.0',
		port:'8080',
		livereload:true,
		middleware:function (connect,opt) {
			return [historyApiFallback];
		}
	});
});

var stylus=require('gulp-stylus'),
	nib=require('nib');

var browserSync = require('browser-sync');	


//preprocesa archivos stylus a css y procesa los cambios 
	gulp.task('css',function () {
		gulp.src('./app/stylesheets/**/*.css')
		//.pipe( stylus({ use:[nib()] } ))
		//.pipe(gulp.dest('.app/stylesheets'))
		.pipe(connect.reload());
	});

//gulp.task('browser-sync', function() {
  //  browserSync.init(["./app/stylesheets/*.css","./app/**/*.html"], {
    //    server: {
      //      baseDir: "./"
        //}
    //});
//});


//recarega el navegador cuando hay cambios en el html

	gulp.task('html',function () {
		gulp.src('./app/**/*.html')
		.pipe(connect.reload());
	});


//inyeccion de dependencias

var inject=require('gulp-inject');
var wiredep=require('wiredep').stream;

//busca en las carpetas de estilos y js los archivos creados para inyectarlos al index

gulp.task('inject',function () {
	var sources=gulp.src(['./app/scripts/**/*.js','./app/stylesheets/**/*.css']);
	return gulp.src('index.html',{cwd:'./app'})
			.pipe(inject(sources,{read:false,
									ignorePath:'/app'}))
			.pipe(gulp.dest('./app'));
});

//inyecta las librerias que instalamos via bower

gulp.task('wiredep',function () {
	gulp.src('./app/index.html')
	.pipe(wiredep({directory:'./app/lib'}))
	.pipe(gulp.dest('./app'));
});



//vigila los cambios que se produzcan y lanza la tarea relacionada

	gulp.task('watch',function () {
		gulp.watch(['./app/stylesheets/**/*.css'],['css']);
		gulp.watch(['./app/stylesheets/**/*.css'],['css','inject']);
		gulp.watch(['./app/scripts/**/*.js','./glupfile.js'],['jshint','inject']);
		gulp.watch(['./bower.json'],['wiredep']);
		gulp.watch(['./app/**/*.html'],['html']);


	});

	gulp.task('default',['server','inject','wiredep','watch']);

