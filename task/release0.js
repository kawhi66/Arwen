const webpack = require('webpack');
const fs = require('fs-extra');
const path = require('path');

/* view.autogeneration.js 暂时不知道该怎么处理 */
/* -------------------------------------------------------------------------------------------------------------------------------------------- */
const $ = require("cheerio").load(fs.readFileSync('./public/index.html'));
let views = [];

$('view').each(function (i, unit) {
    const viewComponent = `./src/view/${unit.attribs.id}.vue`;

    if (!fs.existsSync(viewComponent)) {
        fs.outputFileSync(viewComponent, require('./lib/template')(unit.attribs));
    }

    views.push(unit.attribs);
});

fs.writeFileSync(path.join(process.cwd(), 'src', 'view', 'view.autogeneration.js'), require('lodash').template(`
import __VUE__ from "vue";
import __LIGHT__ from "light";
__VUE__.use(__LIGHT__);
__LIGHT__
<%views.forEach(function(view){%>
    .route({
        path: '/<%=view.id%>',
        <%if(view.async=="true"){%>component: ()=>{return import("./<%=view.id%>.vue")},<%}%>
        <%if(!view.async||view.async=="false"){%>component: require("./<%=view.id%>.vue"),<%}%>
        <%if(view.parent){%>parent:"/<%=view.parent%>",<%}%>
        <%if(view.home){%>home:"/<%=view.home%>",<%}%>
    })
<%})%>`)({
    views
}));
/* -------------------------------------------------------------------------------------------------------------------------------------------- */

/* 编译 */
// development
let compiler = webpack(require('../webpack.dev'), (err, stats) => {
    if (err || stats.hasErrors()) {
        console.log(err || stats.toString())
    };

    const instance = require("webpack-dev-middleware")(compiler);
    require('./lib/browser')(instance);
});

// production
// let compiler = webpack(require('../webpack.prod'), (err, stats) => {
//     if (err || stats.hasErrors()) {
//         console.log(err || stats.toString())
//     };

//     const instance = require("webpack-dev-middleware")(compiler);
//     instance.waitUntilValid(() => instance.close());
// });