# Gulp Combine Language

> Gulp plugin to combine JSON language files

It expects translations to be named as `en.json`, `en-EN.json` or similar. Your project tree might look for example like
```
src/
    app/
        module1/
            languages/
                en.json
                es.json
                eu.json
```
Result: 
```
{
    "FIRST": {
        "HELLO": {
            "en": "Hello",
            "es": "Hola",
            "eu": "Kaixo"
        }
    },
    "SECOND": {
        "THIRD": {
            "WORLD": {
                "en": "World",
                "es": "Mundo",
                "eu": "Mundu"
            }
        },
        "TEST": {
            "en": "Test",
            "es": "",
            "eu": ""
        }
    }
}
```

## Usage

Install `gulp-combine-language` as a development dependency:

```shell
npm install -D gulp-combine-language
```

Add it to your `gulpfile.js`:

```javascript
const combine_language = require("gulp-combine-language");

gulp.src("src/app/**/languages/*.json")
	.pipe(combine_language("translations.json"))
	.pipe(gulp.dest(""));
```