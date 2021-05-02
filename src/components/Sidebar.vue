<template>
  <div class="bg-dark">
    <h2 class="text-light">Chat</h2>
    <span>
      <img class="rounded-circle mt-2" height="30" :src="currentUser.photoURL">
      <span class="text-light">{{ currentUser.displayName }}</span>
    </span>
    <button @click="logout" class="btn btn-light">登出</button>
    <Channels/>
    <Users/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Channels from './Channels'
import Users from './Users'
import firebase from 'firebase'

export default {
  name: 'Sidebar',
  components: { Channels, Users },
  data () {
    return {
      presenceRef: firebase.database().ref('presence')
    }
  },
  computed: {
    ...mapGetters(['currentUser'])
  },
  methods: {
    logout () {
      this.presenceRef.child(this.currentUser.uid).remove()
      firebase.auth().signOut()
      this.$store.dispatch('setUser', null)
      this.$router.push('/login')
    }
  }
}
</script>
