const webpack = require('webpack');
const fs = require('fs-extra');
const path = require('path');
const shell = require('shelljs');
const ARWEN_ENV = process.env.ARWEN_ENV;
const ARWEN_TYPE = process.env.ARWEN_TYPE;
const webpackConfig = require(path.resolve(__dirname, `../${ARWEN_TYPE}-scripts`, ARWEN_ENV == 'development' ? 'webpack.dev' : 'webpack.prod'));

ARWEN_TYPE === 'vue' && autoGenerate();

/* 编译 */
let compiler = webpack(webpackConfig, (err, stats) => {
    if (err || stats.hasErrors()) {
        console.log(err || stats.toString());
        shell.exit(1);
    };

    // 这里能不能直接对外暴露 ？
    const instance = require("webpack-dev-middleware")(compiler);

    if (ARWEN_ENV == 'development') {
        require('./browser')(instance)
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
        
        </style>
        `)(unit.attribs));
        }

        views.push(unit.attribs);
    });

    fs.writeFileSync(resolvePath('./src/view/view.autogeneration.js'), require('lodash').template(`
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