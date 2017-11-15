import path from 'path';
import gulp from 'gulp';
import gutil from 'gulp-util';
import watch from 'gulp-watch';
import browserSync from 'browser-sync';
import source from 'vinyl-source-stream';
import rollup from 'rollup-stream';
import enableSPA from 'connect-history-api-fallback';

import rollupConfig from './rollup.config';

const server = browserSync.create();

const interim = '.tmp';
let watchPhase = false;

const handleErrors = (plugin, name) => {
  plugin.on('error', err => {
    if(!watchPhase) {
      throw new gutil.PluginError(name, err)
    }
    gutil.log(gutil.colors.red(`[${name}]`), err);
    plugin.emit('end');
  });
  return plugin;
};

gulp.task('bundle', () => handleErrors(rollup(rollupConfig), "rollup")
  .pipe(source(path.join('src', 'app-shell.js')))
  .pipe(gulp.dest(interim))
  .pipe(server.stream())
);

gulp.task('serve', ['bundle'], () => {
  server.init({
    ui: false,
    server: {
      baseDir: [interim, '.'],
      middleware: [ enableSPA() ]
    },
    open: false
  });

  watch('src/**/*.js', () => { watchPhase = true; gulp.start(['bundle']) });
  watch('*.html', () => { browserSync.reload() });
});
