const through = require('through');
const path = require('path');
const gutil = require('gulp-util');
const PluginError = gutil.PluginError;
const File = gutil.File;

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
        if (data) {
            data = combineJson(data, json);
        } else {
            data = json;
        }
    }

    function endStream() {
        const joinedPath = path.join(firstFile.base, fileName);
        const joinedFile = new File({
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