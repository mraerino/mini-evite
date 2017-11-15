import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';

export default {
    input: 'src/app-shell.js',
    format: 'es',
    plugins: [
        resolve(),
        commonjs(),
        builtins(),
        globals()
    ],
    sourcemap: true
};
