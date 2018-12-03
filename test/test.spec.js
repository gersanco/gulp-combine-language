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
    const suite1Path = __dirname + '/suite1/';
    const suite2Path = __dirname + '/suite2/';
    beforeEach(async () => {
        await removeFile(`${suite1Path}translations.json`);
        await removeFile(`${suite2Path}translations.json`);
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
        const newJson = combineJson(jsonParse1, jsonParse2, ['en', 'es']);
        let keys = Object.keys(newJson);
        let element = newJson[keys[0]];
        keys = Object.keys(element);
        element = element[keys[0]];
        keys = Object.keys(element);
        expect(keys[0]).to.equal('en');
        expect(keys[1]).to.equal('es');
    })
    it(`should combine json with has't exist key and has 2 languages as key`, () => {
        const json1 = require('./suite2/en.json');
        const json2 = require('./suite2/es.json');
        const jsonParse1 = parseJsonLanguage(json1, 'en');
        const jsonParse2 = parseJsonLanguage(json2, 'es');
        const newJson = combineJson(jsonParse1, jsonParse2, ['en', 'es']);
        let keys = Object.keys(newJson);
        let element = newJson[keys[1]];
        keys = Object.keys(element);
        element = element[keys[1]];
        keys = Object.keys(element);
        expect(keys[0]).to.equal('en');
        expect(keys[1]).to.equal('es');
    })
    it('should there combine 3 file', (done) => {
        gulp.src(suite1Path + '*.json')
            .pipe(combine_languagefiles("translations.json"))
            .pipe(gulp.dest(suite1Path))
            .once('end', () => {
                expect(fs.existsSync(`${suite1Path}translations.json`)).to.equal(true);
                done();
            })
    });

    it('should there combine 3 files with different levels', (done) => {
        gulp.src(suite2Path + '*.json')
            .pipe(combine_languagefiles("translations.json"))
            .pipe(gulp.dest(suite2Path))
            .once('end', () => {
                expect(fs.existsSync(`${suite2Path}translations.json`)).to.equal(true);
                done();
            })
    });

    afterEach(async () => {
        await removeFile(`${suite1Path}translations.json`);
        await removeFile(`${suite2Path}translations.json`);
    })
});