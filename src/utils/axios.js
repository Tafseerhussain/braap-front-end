import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
import store from '@/store'
import router from '@/router'

let ACCESS_TOKEN = 'Access-Token'

const err = (error) => {
    if (error.response) {
        const token = Vue.ls.get(ACCESS_TOKEN)
        switch (error.response.status) {
            case 400:
                router.app.$msg.error('400 Bad Request')
                break
            case 403:
                // show error message: '403 forbidden'
                break
            case 500:
                // show error message: '500 Internal server error'
                break
            case 404:
                // show error message: '404 not found'
                break
            case 504:
                // show error message: '504 time out'
                break
            case 401:
                // show error message: '401 Unauthorized'
                if (token) {
                    store.dispatch('Logout').then(() => {
                        setTimeout(() => {
                            Vue.ls.remove(ACCESS_TOKEN)
                            window.location.reload()
                        }, 1500)
                    })
                }
                break
            default:
                // show error message
                break
        }
    }
    return Promise.reject(error)
};

axios.interceptors.request.use(config => {
    let token = Vue.ls.get(ACCESS_TOKEN)
    if (token && store.token && store.token !== token) {
        // if token has been refreshed in another browser tab, need to refresh window to update state.
        window.location.reload()
    }

    // set token
    if (token) {
        config.headers['Authorization'] = 'Bearer ' + token
    }

    // used for upload files
    if (config.headers['Content-Type'] === 'multipart/form-data') return config

    if (config.method == 'get') {
        config.paramsSerializer = params => {
            return qs.stringify(params, { arrayFormat: 'repeat' })
        }
    }

    return config;
}, function (error) {
    return Promise.reject(error);
});

// response interceptor
axios.interceptors.response.use((response) => {
    if (!response.data.success && response.data.message) {
        router.app.$msg.error(response.data.message)
    }
    return response.data
}, err)

Vue.prototype.$axios = axios

export default axios