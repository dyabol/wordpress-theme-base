const {
   watch,
   series,
   parallel,
   src,
   dest
} = require('gulp');

const sass = require("gulp-sass"),
   babel = require('gulp-babel'),
   uglify = require('gulp-uglify'),
   rename = require("gulp-rename"),
   jshint = require('gulp-jshint'),
   plumber = require('gulp-plumber'), //error handler
   cssnano = require('cssnano'), //minify
   sourcemaps = require('gulp-sourcemaps'),
   notify = require("gulp-notify"),
   imageResize = require("gulp-image-resize"),
   autoprefixer = require('autoprefixer'),
   imagemin = require('gulp-imagemin'),
   postcss = require('gulp-postcss'),
   concat = require('gulp-concat'),
   browserSync = require('browser-sync').create(),
   realFavicon = require('gulp-real-favicon'),
   fs = require('fs'),
   gutil = require('gulp-util'),
   ftp = require('vinyl-ftp'),
   mysqlDump = require('mysqldump'),
   mysql = require('mysql');

const site = {
   name: 'Raf Thor',
   url: 'URL',
   themeUrl: 'http://URL/wp-content/themes/THEME'
};

const localMysql = {
   database: 'database',
   user: 'user',
   password: '',
   host: 'localhost'
};

const ftpSettings = {
   host: '',
   user: '',
   password: '',
   files: [
      'images/**',
      'js/dist/**',
      'fonts/**',
      '*.php',
      'style.css',
      'screenshot.jpg'
   ],
   dest: '/www/domains/DOMAIN/wp-content/themes/wordpress-theme-base'
};

// File where the favicon markups are store
const faviconSettings = {
   dataFile: 'faviconData.json',
   injectFaviconFiles: ["favicons.php"],
   masterPicture: './images/logo.png',
   dest: './images/favicons',
   iconsPath: site.themeUrl + '/images/favicons'
};

const syncProxy = "http://localhost/",
   syncPort = 3000,
   syncFiles = [
      "./js/dist/all.min.js",
      "style.css",
      "*.php",
      "**/*.php",
   ];

const jsWatch = './js/src/**/*.js',
   jsSrc = './js/src/script.js',
   jsConcatSrc = [
      './js/lib/jquery-3.3.1.min.js',
      './js/lib/smooth-scroll.min.js',
      './js/dist/script.min.js'
   ],
   jsDest = './js/dist';

const sassWatch = './sass/**/*.scss',
   sassSrc = './sass/style.scss',
   sassDest = '.';

const imgSrc = './images/src/*',
   imgDest = './images/dist/';

function jsBuild() {
   return src(jsSrc)
      .pipe(sourcemaps.init())
      .pipe(plumber())
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish', {
         beep: true
      }))
      .pipe(babel({
         presets: ['@babel/env']
      }))
      .pipe(uglify())
      .pipe(rename({
         extname: '.min.js'
      }))
      .pipe(sourcemaps.write("."))
      .pipe(dest(jsDest));
}

function jsConcat() {
   return src(jsConcatSrc)
      .pipe(concat('all.min.js'))
      .pipe(dest(jsDest))
      /*.pipe(notify({
         message: "Successful build.",
         title: "JavaScript",
         onLast: true
      }))*/;
}

function sassBuild() {
   return src(sassSrc)
      .pipe(sourcemaps.init())
      .pipe(plumber())
      .pipe(sass({
         includePaths: require("bourbon-neat").includePaths
      }).on('error', notify.onError({
         message: "Error: <%= error.message %>",
         title: "SASS",
         onLast: true
      })))
      .pipe(postcss([
         autoprefixer(),
         cssnano()
      ]))
      .pipe(sourcemaps.write("."))
      .pipe(dest(sassDest))
      /*.pipe(notify({
         message: "Successful build.",
         title: "SASS",
         onLast: true
      }))*/;
}

function watcher() {
   watch(sassWatch, {
      ignoreInitial: true
   }, sassBuild);
   watch(jsWatch, {
      ignoreInitial: true
   }, series(jsBuild, jsConcat));
}

function proxy() {
   browserSync.init({
      proxy: syncProxy,
      port: syncPort,
      watch: true,
      ignoreInitial: true,
      files: syncFiles
   });
}

function compressImages() {
   return src(imgSrc)
      .pipe(imageResize({
         width: 1250,
         height: 800,
         crop: true,
         upscale: false
      }))
      .pipe(imagemin({
         progressive: true,
         optimizationLevel: 3
      }))
      .pipe(dest(imgDest))
}

function generateFavicon(done) {
   realFavicon.generateFavicon({
      masterPicture: faviconSettings.masterPicture,
      dest: faviconSettings.dest,
      iconsPath: faviconSettings.iconsPath,
      design: {
         ios: {
            pictureAspect: 'backgroundAndMargin',
            backgroundColor: '#ffffff',
            margin: '35%',
            assets: {
               ios6AndPriorIcons: false,
               ios7AndLaterIcons: false,
               precomposedIcons: false,
               declareOnlyDefaultIcon: true
            }
         },
         desktopBrowser: {},
         windows: {
            pictureAspect: 'noChange',
            backgroundColor: '#ffffff',
            onConflict: 'override',
            assets: {
               windows80Ie10Tile: false,
               windows10Ie11EdgeTiles: {
                  small: false,
                  medium: true,
                  big: false,
                  rectangle: false
               }
            }
         },
         androidChrome: {
            pictureAspect: 'shadow',
            themeColor: '#ffffff',
            manifest: {
               name: site.name,
               startUrl: site.url,
               display: 'standalone',
               orientation: 'notSet',
               onConflict: 'override',
               declared: true
            },
            assets: {
               legacyIcon: false,
               lowResolutionIcons: false
            }
         },
         safariPinnedTab: {
            pictureAspect: 'silhouette',
            themeColor: '#cd7e08'
         }
      },
      settings: {
         scalingAlgorithm: 'Mitchell',
         errorOnImageTooSmall: true,
         readmeFile: true,
         htmlCodeFile: false,
         usePathAsIs: false
      },
      markupFile: faviconSettings.dataFile
   }, function() {
      done();
   });
};

function injectFaviconMarkups() {
   var files = faviconSettings.injectFaviconFiles;
   for (let i = 0; i < files.length; i++) {
      fs.writeFile(files[i], '', function(err) {
         console.error(err);
      });
   }
   return src(faviconSettings.injectFaviconFiles)
      .pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(faviconSettings.dataFile)).favicon.html_code))
      .pipe(dest('.'));
};

function checkForFaviconUpdate(done) {
   var currentVersion = JSON.parse(fs.readFileSync(faviconSettings.dataFile)).version;
   realFavicon.checkForUpdates(currentVersion, function(err) {
      if (err) {
         throw err;
      }
   });
};

function dbDump(done) {
   return new Promise((resolve, reject) => {
      var db = localMysql;
      mysqlDump({
         connection: db,
         dumpToFile: 'sql/dump.sql'
      }, (err) => {
         if (err !== null) return reject(err);
      });
      done();
   }).catch((err) => {
      console.log(err);
   });
}

function dbTest(done) {
   var connection = mysql.createConnection(localMysql);
   connection.connect(function(err) {
      if (err) {
         console.error('error connecting: ' + err.stack);
         return;
      }
      console.log('connected as id ' + connection.threadId);
   });
   connection.query("SHOW TABLES;", (error, results) => {
      if (error) throw error;
      console.log(results);
   });
   connection.end(function() {
      done();
   });
}

function deploy() {
   const conn = ftp.create({
      host: ftpSettings.host,
      user: ftpSettings.user,
      password: ftpSettings.password,
      parallel: 10,
      log: gutil.log
   });

   return src(ftpSettings.files, {
         base: '.',
         buffer: false
      })
      .pipe(conn.newer(ftpSettings.dest)) // only upload newer files
      .pipe(conn.dest(ftpSettings.dest))
      /*.pipe(notify({
         message: "Upload to " + ftpSettings.dest + " is done.",
         title: "Deploy - compete!",
         onLast: true
      }))*/;
}

// natartuje watchery a proxy server
exports.default = parallel(watcher, proxy);
// buildne js a css
exports.build = series(sassBuild, jsBuild, jsConcat);
// nahraje soubory na FTP
exports.deploy = deploy;
// snizeni veliksoi dat obrazku
exports["compress-images"] = compressImages;
// kontroluje zda nejsou zmeny v generatoru favicon
exports['check-for-favicon-update'] = checkForFaviconUpdate;
// vlozi odkazy na favicony do headeru
exports['inject-favicon-markups'] = injectFaviconMarkups;
// generuje favicony
exports['generate-favicon'] = generateFavicon;
// dump databaze
exports['dbdump'] = dbDump;
exports['dbtest'] = dbTest;