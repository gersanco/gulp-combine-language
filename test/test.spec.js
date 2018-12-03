const expect = require("chai").expect;
const fs = require("fs");
const path = require('path');
const gulp = require('gulp');

const combine_languagefiles = require("../index");

const {
    removeFile,
    parseJsonLanguage,
    combineJson
} = require('../lib/util');


describe('Combine JSON', () => {
    beforeEach(async () => {
        await removeFile(__dirname + '/translations.json');
    });
    it('should return same json with language include as key', () => {
        const json = require('./suite2/en.json');
        const newJson = parseJsonLanguage(json, 'en');
        let keys = Object.keys(newJson);
        let element = newJson[keys[0]];
        keys = Object.keys(element);
        element = element[keys[0]];
        keys = Object.keys(element);
        expect(keys[0]).to.equal('en');
    })
    it('should combine json and has 2 languages as key', () => {
        const json1 = require('./suite2/en.json');
        const json2 = require('./suite2/es.json');
        const jsonParse1 = parseJsonLanguage(json1, 'en');
        const jsonParse2 = parseJsonLanguage(json2, 'es');
        const newJson = combineJson(jsonParse1, jsonParse2);
        let keys = Object.keys(newJson);
        let element = newJson[keys[0]];
        keys = Object.keys(element);
        element = element[keys[0]];
        keys = Object.keys(element);
        expect(keys[0]).to.equal('en');
        expect(keys[1]).to.equal('es');
    })
    it('should there 3 languages in a key', () => {
        gulp.src(__dirname + '/suite1/*.json')
            .pipe(combine_languagefiles("translations.json"))
            .pipe(gulp.dest(__dirname + '/suite1/'));
    });

    it('should there 3 languages in a key', () => {
        gulp.src(__dirname + '/suite2/*.json')
            .pipe(combine_languagefiles("translations.json"))
            .pipe(gulp.dest(__dirname + '/suite2/'));
    });

    afterEach(async () => {
        await removeFile(__dirname + '/translations.json');
    })
});