<template>
  <div>
    <div class="text-light">
      <h4>Users</h4>
        <div class="mt-4">
          <button v-for="user in users" class="list-group-item list-group-item-action" type="button" :class="{'active': isActive(user)}" @click.prevent="changeChannel(user)">
            <span :class="{'fa fa-circle online': isOnline(user), 'fa fa-circle offline': !isOnline(user)}"></span>
            <span>
              <img :src="user.avatar" height="20" class="img rounded-circle">
              <span><a :class="{'text-light': isActive(user)}">{{ user.name }}</a></span>
            </span>
          </button>
        </div>
    </div>
  </div>
</template>

<script>
import database from 'firebase/database'
import { mapGetters } from 'vuex'

export default {
  name: 'users',
  data () {
    return {
      users: [],
      usersRef: firebase.database().ref('users'),
      connectedRef: firebase.database().ref('.info/connected'),
      presenceRef: firebase.database().ref('presence')
    }
  },
  computed: {
    ...mapGetters(['currentUser', 'currentChannel'])
  },
  methods: {
    addListeners () {
      this.usersRef.on('child_added', (snapshot) => {
        if (this.currentUser.uid !== snapshot.key) {
          const user = snapshot.val()
          user.uid = snapshot.key
          user.status = 'offline'
          this.userd.push(user)
        }
      })

      this.presenceRef.on('child_added', snapshot => {
        if (this.currentUser.uid !== snapshot.key) {
          this.addStatusToUser(snapshot.key)
        }
      })

      this.presenceRef.on('child_removed', snapshot => {
        if (this.currentUser.uid !== snapshot.key) {
          this.addStatusToUser(snapshot.key, false)
        }
      })

      this.connectedRef.on('value', snapshot => {
        if (snapshot.val() === true) {
          const ref = this.presenceRef.child(this.currentUser.uid)
          ref.set(true)
          ref.onDisconnect().remove
        }
      })
    },
    // 用戶狀態
    addStatusToUser (userId, connected = true) {
      const index = this.users.findIndex(user => user.uid === userId)
      if (index !== -1) {
        connected === true ? this.users[index].status = 'online' : this.users[index].status = 'offline'
      }
    },
    isOnline (user) {
      return user.status == 'online'
    },
    detachListeners () {
      this.usersRef.off()
      this.presenceRef.off()
      this.connectedRef.off()
    },
    // 切換頻道
    changeChannel (user) {
      const channelId = this.getChannelId(user.uid)
      const channel = { id: channelId, name: user.name }
      this.$store.dispatch('setPrivate', true)
      this.$store.dispatch('setCurrentChannel', channel)
    },
    isActive (user) {
      const channelId = this.getChannelId(user.uid)
      return this.currentChannel.id === channelId
    },
    getChannelId (userId) {
      return userId < this.currentUser.uid ? userId + '/' + this.currentUser.uid : this.currentUser.uid + '/' + userId
    }
  },
  mounted () {
    this.addListeners()
  },
  beforeDestroy () {
    this.detachListeners()
  }
}
</script>
