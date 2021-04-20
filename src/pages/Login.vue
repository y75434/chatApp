<template>
  <div>
    <div class="jumbotron bg-primary text-white p-3 text-center">
    <h1>Go Chat</h1>
    <p>您的好幫手</p>
  </div>
  <div class="alert alert-info" v-if="loading">請稍候......</div>
  <div class="alert alert-danger" v-if="hasErrors">
    <div v-for="error in errors" :key="error.id">{{ error }}</div>
  </div>
  <div class="container-fluid">
    <div class="row mt-5">
      <div class="col text-center">
        <button @click="loginWithGoogle()" type="button" class="btn btn-outline-danger">Google登入</button>
      </div>
    </div>
    <div class="row mt-5">
      <div class="col text-center">
        <button type="button" class="btn btn-outline-info">Twitter登入</button>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
// import auth from 'firebase/auth'
// import firebase from 'firebase/app'
// import database from '../firebase/database'
import firebase from 'firebase'

export default {
  name: 'Login',
  data () {
    return {
      email: '',
      password: '',
      forgot_password: '',
      // fpform: false,
      errors: [],
      loading: false,
      usersRef: firebase.database().ref('users')
    }
  },
  computed: {
    hasErrors () {
      return this.errors.length > 0
    }
  },
  methods: {
    login () {
      this.errors = []
      // if (!this.isFormValid()) {
      this.isLoading = true

      firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(response => {
        const user = response.user

        this.$store.dispatch('setUser', user)
        this.$router.push('/')
      }).catch(error => {
        this.errors.push(error.message)
        this.isLoading = false
      })
      // }
    },
    // isFormValid(){

    // }
    loginWithGoogle () {
      this.loading = true
      this.errors = []
      firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then((response) => {
          // 存用戶資料到db
          this.saveUserToUsersRef(response.user)
          this.$store.dispatch('setUser', response.user)
          this.$router.push('/')
        })
        .catch(error => {
          this.errors.push(error.message)
          this.loading = false
        })
    },
    saveUserToUsersRef (user) {
      return this.usersRef.child(user.uid).set({
        name: user.displayName,
        avatar: user.photoURL
      })
    },
    loginWithTwitter () {
      this.loading = true
      this.errors = []
      firebase.auth().signInWithPopup(new firebase.auth.TwitterAuthProvider())
        .then((response) => {

        })
    }
  }
}
</script>
