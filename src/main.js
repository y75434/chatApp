import Vue from 'vue'
import App from './App.vue'
import router from './router'
import firebase from 'firebase/app'
import store from './store'

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

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
