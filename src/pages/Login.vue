<template>
  <div>
    <div class="jumbotron bg-primary text-white p-3 text-center">
    <h1>Go Chat</h1>
    <p>您的好幫手</p>
  </div>
  <div class="container-fluid">
    <div class="row mt-5">
      <div class="col text-center">
        <button @click="loginWithGoogle" type="button" class="btn btn-outline-danger">Google登入</button>
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
// import firebase from 'firebase'
// import auth from 'firebase/auth'

export default {
  name: 'Login'
  // methods: { 目前無法使用
  //   loginWithGoogle () {
  //     firebase.auth().signWithPopup(new firebase.auth.GoogleAuthProvider())
  //       .then((response) => {
  //         console.log(response.user)
  //       })
  //   }
  // }
}
</script>
