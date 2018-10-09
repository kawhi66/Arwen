const ARWEN_ENV = process.env.ARWEN_ENV;
const ARWEN_TYPE = process.env.ARWEN_TYPE;
const ARWEN_PORT = process.env.ARWEN_PORT;
const fs = require('fs-extra');
const path = require('path');
const shell = require('shelljs');
const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const webpackConfig = require(path.resolve(__dirname, `../${ARWEN_TYPE}-scripts`, ARWEN_ENV == 'development' ? 'webpack.dev' : 'webpack.prod'));
// console.log(webpackConfig);

ARWEN_TYPE === 'vue' && autoGenerate();

/* 编译 */
let compiler = webpack(webpackConfig, (err, stats) => {
    if (err || stats.hasErrors()) {
        console.log(err || stats.toString());
        shell.exit(1);
    };

    // 这里不能直接对外暴露 ？
    // const instance = require("webpack-dev-middleware")(compiler);

    if (ARWEN_ENV == 'development') {
        // require('./browser')(instance)

        const options = {
            contentBase: resolvePath('build'),
            watchContentBase: true,
            hot: true,
            open: true,
            host: "localhost",
            port: ARWEN_PORT
        };

        webpackDevServer.addDevServerEntrypoints(webpackConfig, options);
        const server = new webpackDevServer(compiler, options);
        server.listen(ARWEN_PORT, 'localhost', () => {
            console.log(`dev server listening on port ${ARWEN_PORT}`);
        });
    } else if (ARWEN_ENV == 'production') {
        instance.waitUntilValid(() => {
            instance.close();
            shell.echo('\nbuild finished!');
            shell.exit(0);
        })
    }
});

function resolvePath(route) {
    return path.resolve(process.cwd(), route)
}

function autoGenerate() {
    /* view.autogeneration.js 暂时不知道该怎么处理 */
    /* -------------------------------------------------------------------------------------------------------------------------------------------- */
    const $ = require("cheerio").load(fs.readFileSync(resolvePath('./public/index.html')));
    let views = [];

    $('view').each(function (i, unit) {
        const viewComponent = resolvePath(`./src/view/${unit.attribs.id}.vue`);

        /* 根据模本自动生成缺失的 vue 文件 */
        if (!fs.existsSync(viewComponent)) {
            fs.outputFileSync(viewComponent, require('lodash').template(`
<template>
    <div>
        Hello,World !
    </div>
</template>
<script>
    export default {
        data(){
            return {}
        }
    }
</script>
<style lang="less">

</style>`)(unit.attribs))
        };

        views.push(unit.attribs);
    });

    fs.writeFileSync(resolvePath('./src/view/view.autogeneration.js'), require('lodash').template(`
/******************************************************************************************************************************************************
 ************************ this script generate automatically, please do not modify. it looks guly and unreasonable, i know, i am working on it! ************************
 ******************************************************************************************************************************************************/

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
}