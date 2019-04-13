# Get started

[Arwen](https://github.com/kawhi66/arwen) has some interesting abilities that could be used for project management in front-end. Typically, arwen now could completely handle a [vue](https://cn.vuejs.org) project based on [h_ui](https://www.npmjs.com/package/h_ui) component library.

Get started with a simple command `arwen create h_ui-demo`.  
Need more help, try `arwen --help`.

## Installation

Prerequisites: Node.js (>=10.x, 10.15.3 preferred), npm version 3+.

     $ npm install -gd @arwen/arwen-cli

## Usage

For now, [arwen](https://github.com/kawhi66/arwen) has 4 simple but powerful commands including `create` `serve` `build` `deploy`.

`arwen create h_ui-demo`

`arwen create` could be used for generating a project based on [h_ui](https://www.npmjs.com/package/h_ui) template. It is gonna take care of the building process properly. [Yarn](https://yarnpkg.com/zh-Hant/) is extremely recommend in this command. If you never use or hear about it, give it a shot. By running this comand, after it finished without surprise, a directory named h_ui-demo with following structures will be generated.

```javascript
./h_ui-demo/
├── README.md
├── index.html
├── sysconfig.js
├── src
│   ├── App.vue
│   ├── main.js
│   ├── api
│   ├── assets
│   ├── components
│   ├── directive
│   ├── mixins
│   ├── mock
│   ├── router
│   ├── store
│   ├── style
│   ├── utils
│   └── views
└── package.json
```

As you can see, it is extremely similar with the demo project supplied by [h_ui](https://www.npmjs.com/package/h_ui), if you are familiar with it.

`arwen serve -h 127.0.0.1 -p 3001`

`arwen serve` could be used for launching a server in development mode with minimal config. Generally, it is necessary for business development. A magic feature called [HMR (Hot Module Replacement)](https://webpack.js.org/concepts/hot-module-replacement) is embedded, any change happened inside the src directory will trigger a hot reload in broswer.

`arwen build --debug --zip --package-name h_ui-demo`

`arwen build` could be used for compiling and building in production mode. Not like build in development mode, [arwen](https://github.com/kawhi66/arwen) will build to create better user experience in optimized way.

If you specify `--debug`, build process will be a little different. Source map switch will open in production mode, this could be useful for test, you could simply debug with dev tool in broswer.

if you specify `--zip --package-name h_ui-demo`, a zip file named h_ui-demo will be created. That could be useful for sharing or remoting deployment.

`arwen deploy ./build`

Mostly, after the project build, we wanna know if it is gonna work as we expected or not. `arwen deploy` could simply serve a static directory in local, it is almost like running in real production environment. If something goes wrong, you could locate and fix it quickly and run build again. In the future, [arwen](https://github.com/kawhi66/arwen) may support remote deployment in server-side like [nginx](https://nginx.org/en/).

The process management by [arwen](https://github.com/kawhi66/arwen) is through the `--signal` option. For now, valid choices include `start` `list` `stop`. When you run `arwen deploy -s list`, a table including all apps running in local will be printed, it looks like

```javascript
┌─────────┬────────────┬────┬───────┬──────────┬────────────┬────────┬───────────────┐
│ (index) │    name    │ id │  pid  │  status  │    path    │  port  │  created_at   │
├─────────┼────────────┼────┼───────┼──────────┼────────────┼────────┼───────────────┤
│    0    │ './build/' │ 0  │ 92747 │ 'online' │ './build/' │ '8080' │ 1555134009451 │
└─────────┴────────────┴────┴───────┴──────────┴────────────┴────────┴───────────────┘
```

Column **Id** could be used for `arwen deploy -s stop --app-id 0` command. And please note that, specifying an explicit app id is highly recommended, if not, all apps running locally will be destroyed.

That's all for now, issues and good ideas are both welcomed, just put here <https://github.com/kawhi66/arwen/issues>
