const fs = require("fs");

function removeFile(path) {
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

function combineJson(jsonFirst, jsonSecond, languages) {
    const newJson = Object.assign(jsonFirst, {});

    let keysFirst = Object.keys(jsonFirst);
    let keysSecond = Object.keys(jsonSecond);

    const max = keysFirst.length >= keysSecond.length ? keysFirst.length : keysSecond.length;

    for (let i = 0; i < max; i++) {
        if(!keysFirst[i]) {
            newJson[keysSecond[i]] = jsonSecond[keysSecond[i]];
        }
        if(!keysSecond[i]) {
            jsonSecond[keysFirst[i]] = jsonFirst[keysFirst[i]];
        }
    }

    const keys = Object.keys(newJson);

    for (let i = 0; i < keys.length; i++) {
        const elementFirst = jsonFirst[keys[i]];

        if (typeof elementFirst === 'object') {

            // the second element is a TAG
            const elementSecond = jsonSecond[keys[i]];

            if (elementSecond) {
                const res = combineJson(elementFirst, elementSecond, languages);   
                newJson[keys[i]] = res;
            }

        } else {
            
            // the second element is a language string
            const elementSecond = jsonSecond[keysSecond[i]];
            newJson[keys[i]] = elementFirst;
            newJson[keysSecond[i]] = elementSecond;

            const lang = languages.filter(language => !keys.includes(language) && !keysSecond.includes(language));

            const res = includeLang(lang);

            if(Object.keys(res).length > 0) {
                Object.assign(newJson, res); 
            }

        }
    }
    return newJson;
}

function includeLang(langs) {
    const newJson = {};
    langs.forEach((lang) => {
       newJson[lang]= '';
    });
    return newJson;
}

module.exports = {
    removeFile,
    combineJson,
    parseJsonLanguage
}