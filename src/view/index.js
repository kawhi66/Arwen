
        /**AUTO-GEN-START*/
        import __VUE__ from "vue"
        __VUE__.use(__LIGHT__);
        import __LIGHT__ from "light"
        __LIGHT__
        
        .route({
            path: '/index',
            
            component: require("./index.vue"),
            
            
        })
        
        .route({
            path: '/index/home',
            
            component: require("./index/home.vue"),
            parent:"/index",
            home:"/true",
        })
        
        .route({
            path: '/index/about',
            
            component: require("./index/about.vue"),
            parent:"/index",
            
        })
        
        .route({
            path: '/index/contact',
            
            component: require("./index/contact.vue"),
            parent:"/index",
            
        })
        
        .route({
            path: '/test',
            
            component: require("./test.vue"),
            
            
        })
        
        /**AUTO-GEN-END*/
    