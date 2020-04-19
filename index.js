const through = require('through');
const path = require('path');
const PluginError = require('plugin-error');
const Vinyl = require('vinyl');

const {
    parseJsonLanguage,
    combineJson
} = require('./lib/util');


module.exports = function (fileName) {
    if (!fileName) {
        throw new PluginError('gulp-combine-language', 'Missing fileName option for gulp-combine-language');
    }

    let data;
    let firstFile = null;
    const LANG = [];

    function bufferContents(file) {
        if (!firstFile) {
            firstFile = file;
        }

        if (file.isNull()) {
            return; // ignore
        }
        if (file.isStream()) {
            return this.emit('error', new PluginError('gulp-combine-languages-file', 'Streaming not supported'));
        }

        const jsonData = JSON.parse(file.contents.toString());

        /* Extract file name and language */
        /* Expects files to be named en.json or en-EN.json or similar */
        const fileName = file.relative.split('/').slice(-1)[0];
        const lang = fileName.split('.').slice(0)[0];

        const json = parseJsonLanguage(jsonData, lang);
        LANG.push(lang);
        if (data) {
            data = combineJson(data, json, LANG);
        } else {
            data = json;
        }
    }

    function endStream() {
        const joinedPath = path.join(firstFile.base, fileName);
        const joinedFile = new Vinyl({
            cwd: firstFile.cwd,
            base: firstFile.base,
            path: joinedPath,
            contents: new Buffer.from(JSON.stringify(data))
        });
        this.emit('data', joinedFile);
        this.emit('end');
    }
    return through(bufferContents, endStream);
};
