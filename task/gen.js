const glob = require('glob');
const cheerio = require('cheerio');
const lodash = require('lodash');
const fs = require('fs-extra');

/* light gen */
glob("./public/*.html", function (err, files) {
    if (err) throw new err;

    files.forEach(function (file) {
        const $ = cheerio.load(fs.readFileSync(file));

        lodash.forEach($('view'), function (unit) {
            const viewComponent = `src/view/${unit.attribs.id}.vue`;

            if (fs.existsSync(viewComponent)) {
                console.log(`代码已经存在${unit.attribs.id}.vue`)
            } else {
                fs.outputFileSync(viewComponent, require('./lib/template')(unit.attribs));
                console.log(`代码生成成功，文件：${unit.attribs.id}.vue`)
            }
        })
    });
})