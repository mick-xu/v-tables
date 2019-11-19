import Tables from "./tables";



Tables.install = function (Vue) {
    Vue.compoent(Tables.name, Tables)
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

export default Tables