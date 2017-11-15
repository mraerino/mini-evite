import minify from 'rollup-plugin-babel-minify';
import cjs from 'rollup-plugin-commonjs';
import copy from 'rollup-plugin-copy';
import nodeGlobals from 'rollup-plugin-node-globals';
import nodeBuiltins from 'rollup-plugin-node-builtins';
import nodeResolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import minifyLit from '@mraerino/rollup-plugin-minifyliterals';
import browsersync from 'rollup-plugin-browsersync';
import historyApi from 'connect-history-api-fallback';
import path from 'path';

const distTarget = './dist';
const dist = (dest = "") => path.join(distTarget, dest);

const srcTarget = './src';
const src = (dest = "") => path.join(srcTarget, dest);

const isProduction = process.env.NODE_ENV === 'production';

export default {
    input: src('app.ts'),
    output: {
        file: dist('app.js'),
        format: 'iife',
        sourcemap: !isProduction
    },
    plugins: [
        nodeBuiltins(),
        nodeResolve({
            jsnext: true,
            main: true
        }),
        typescript(),
        copy({
            [src('index.html')]: dist('index.html'),
            './node_modules/normalize-css/normalize.css': dist('node_modules/normalize-css/normalize.css'),
        }),
        cjs(),
        nodeGlobals(),
        isProduction ? minifyLit({
            exclude: "node_modules/**",
            includeExtension: ['.ts', '.js'],
            htmlminifier: {
                minifyCSS: false, // causes some kind of trouble currently
                collapseWhitespace: true
            }
        }) : null,
        isProduction ? minify({ comments: false }) : null,
        !!process.env.ROLLUP_WATCH ? browsersync({
            server: {
                baseDir: dist(),
                middleware: [ historyApi() ]
            },
            open: false
        }) : null
    ].filter(plugin => plugin !== null),
    watch: {
        include: 'src/**'
    }
};
