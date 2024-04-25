import focus from './modules/v-focus';

export default {
    install(Vue) {
        Vue.directive('focus', focus);
    }
}