import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from 'firebase/app'
import store from './store'
import $ from 'jquery'
import 'bootstrap'
import vuetify from './plugins/vuetify'
import VueChatScroll from 'vue-chat-scroll'

Vue.prototype.$bus = new Vue()
Vue.use(VueChatScroll)

window.$ = $
// window.jQuery = jQuery

Vue.config.productionTip = false

var firebaseConfig = {
  apiKey: 'AIzaSyDnZUYzlqGFNwvPfQFG7DoOYAljlSMutGI',
  authDomain: 'chat-8de40.firebaseapp.com',
  projectId: 'chat-8de40',
  storageBucket: 'chat-8de40.appspot.com',
  messagingSenderId: '880185915464',
  appId: '1:880185915464:web:7c9d5637d746416ec9407d'
}
firebase.initializeApp(firebaseConfig)

window.firebase = firebase

const unsubscribe = firebase.auth().onAuthStateChanged(user => {
  store.dispatch('setUser', user)

  new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
  }).$mount('#app')

  unsubscribe()
})
