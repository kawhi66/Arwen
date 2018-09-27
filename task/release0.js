const webpack = require('webpack');
const fs = require('fs-extra');
const path = require('path');

const $ = require("cheerio").load(fs.readFileSync('./public/index.html'));
const views = $('view');
const vueTemplate = require('lodash').template(`
        /**AUTO-GEN-START*/
        import __VUE__ from "vue"
        __VUE__.use(__LIGHT__);
        import __LIGHT__ from "light"
        __LIGHT__
        <%views.forEach(function(view){%>
        .route({
            path: '/<%=view.id%>',
            <%if(view.async=="true"){%>component: ()=>{return import("./<%=view.id%>.vue")},<%}%>
            <%if(!view.async||view.async=="false"){%>component: require("./<%=view.id%>.vue"),<%}%>
            <%if(view.parent){%>parent:"/<%=view.parent%>",<%}%>
            <%if(view.home){%>home:"/<%=view.home%>",<%}%>
        })
        <%})%>
        /**AUTO-GEN-END*/
    `);

let v = [];
views.each(function (i, view) {
    v.push(view.attribs)
});

let vueViewString = vueTemplate({
    views: v
});

fs.writeFileSync(path.join(process.cwd(), 'src', 'view', 'index.js'), `${vueViewString}`);

// console.log(process.env.NODE_ENV);

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