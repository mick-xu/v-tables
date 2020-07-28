import Tables from './Tables'
import { set } from "./libs/api.request";

Tables.install = function (Vue, opts = {}) {
    set(opts.baseUrl, opts.token)
    Vue.component(Tables.name, Tables)
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

export default Tables
