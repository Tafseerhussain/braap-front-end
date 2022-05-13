import Vue from 'vue'
import router from '@/router'
import store from '@/store'
import { constantRouteMap } from "@/router"

let ACCESS_TOKEN = 'Access-Token'

const whiteList = (routes, name) => {
    let item = routes.find(x => x.name === name)
    if (item) return true
    else {
        for (var i = 0; i < routes.length; i++) {
            if (routes[i].children) {
                let result = whiteList(routes[i].children, name)
                if (result)
                    return true
            }
        }
    }
    return false
}

router.beforeEach((to, from, next) => {
    if (Vue.ls.get(ACCESS_TOKEN)) {
        if (to.name === 'Login' || to.name === 'Registration' || to.name === 'ForgotPassword') {
            next({ path: '/' })
            // NProgress.done()
        } else {
            const redirect = decodeURIComponent(from.query.redirect || to.path)
            if (to.path === redirect) {
                // set the replace: true so the navigation will not leave a history record
                next()
            } else {
                // 跳转到目的路由
                next({ path: redirect })
            }
        }
    } else {
        if (whiteList(constantRouteMap, to.name)) {
            next()
        } else {
            store.commit('setToken', '')
            next({ name: 'Login', query: { redirect: to.fullPath } })
            // NProgress.done()
        }
    }
})

router.afterEach((to) => {
    // NProgress.done() // finish progress bar
    const { hash } = to
    if (hash) {
        setTimeout(() => {
            router.app.$vuetify.goTo(hash, { duration: 300, easing: 'easeInOutCubic', offset: 0 })
        }, 100);
    }

    // set document title
    if (to.meta && to.meta.title) {
        document.title = to.meta.title + ' | Braap'
    }
})