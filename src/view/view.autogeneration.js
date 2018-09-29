
import __VUE__ from "vue";
import __LIGHT__ from "light";
__VUE__.use(__LIGHT__);
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
