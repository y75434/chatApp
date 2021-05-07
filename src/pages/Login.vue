<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="5">
        <v-card class="text-center">
          <div class="text-center" style="padding:30px">
              <v-img src="../assets/slack.png" alt="Slack" ></v-img>
          </div>
          <v-card-text>
            <h2>登入Slack</h2>
            <h5>我們建議使用你的工作電子郵件地址。</h5>
          </v-card-text>
          <div class="align-center" style="padding:15px">
              <v-btn color="#4a154b" @click="loginWithGoogle()" class="white--text">使用 Google 登入</v-btn>
            </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'Login',
  data () {
    return {
      usersRef: firebase.database().ref('users')
    }
  },
  methods: {
    loginWithGoogle () {
      this.errors = []
      firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then((response) => {
          // 存用戶資料到db
          this.saveUserToUsersRef(response.user)
          this.$store.dispatch('setUser', response.user)
          this.$router.push('/')
        })
        .catch(error => {
          console.log(error.message)
        })
    },
    saveUserToUsersRef (user) {
      return this.usersRef.child(user.uid).set({
        name: user.displayName,
        avatar: user.photoURL
      })
    }
  }
}
</script>
