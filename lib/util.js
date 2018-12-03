const fs = require("fs");

async function removeFile(path) {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
}

function parseJsonLanguage(json, language) {
    const newJson = {};
    const keys = Object.keys(json);
    for (let i = 0; i < keys.length; i++) {
        const element = json[keys[i]];
        if (typeof element === 'object') {
            const res = parseJsonLanguage(element, language);
            newJson[keys[i]] = res;
        } else {
            if (!newJson[keys[i]]) {
                newJson[keys[i]] = {};
            }
            newJson[keys[i]][language] = element;
        }
    }
    return newJson;
}

function combineJson(jsonFirst, jsonSecond) {
    const newJson = Object.assign(jsonFirst, {});
    const keysFirst = Object.keys(jsonFirst);
    const keysSecond = Object.keys(jsonSecond);
    const max = keysFirst.length >= keysSecond.length ? keysFirst.length : keysSecond.length;
    for (let i = 0; i < max; i++) {
        if(!keysFirst[i]) {
            newJson[keysSecond[i]] = jsonSecond[keysSecond[i]];
        }
    }
    const keys = Object.keys(newJson);
    for (let i = 0; i < keys.length; i++) {
        const elementFirst = jsonFirst[keys[i]];
        const elementSecond = jsonSecond[keysSecond[i]];
        if (typeof elementFirst === 'object') {
            const res = combineJson(elementFirst, elementSecond);
            newJson[keys[i]] = res;
        } else {
            newJson[keys[i]] = elementFirst;
            newJson[keysSecond[i]] = elementSecond;
        }
    }
    return newJson;
}

module.exports = {
    removeFile,
    combineJson,
    parseJsonLanguage
}