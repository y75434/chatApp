<template>
  <div>
    <div class="text-dark">
      <h4>Users</h4>
        <div class="mt-4">
          <button v-for="user in users" :key="user.id" class="list-group-item list-group-item-action" type="button" :class="{'active': isActive(user)}" @click.prevent="changeChannel(user)">
            <span :class="{'fa fa-circle online': isOnline(user), 'fa fa-circle offline': !isOnline(user)}"></span>
            <span>
              <img :src="user.avatar" height="40" class="img rounded-circle">
              <span>
                <a :class="{'text-light': isActive(user)}">{{ user.name }}</a>
                <span class="float-right" v-if="getNotification(user) >= 1">{{ getNotification(user) }}</span>
              </span>
            </span>
          </button>
        </div>
    </div>
  </div>
</template>

<script>
// import database from 'firebase/database'
import { mapGetters } from 'vuex'
import mixin from '../mixins'
import firebase from 'firebase'

export default {
  name: 'users',
  data () {
    return {
      users: [],
      usersRef: firebase.database().ref('users'),
      connectedRef: firebase.database().ref('.info/connected'),
      presenceRef: firebase.database().ref('presence'),
      privateMessagesRef: firebase.database().ref('privateMessages'),
      notifCount: [],
      channel: null
    }
  },
  mixins: [mixin],
  computed: {
    ...mapGetters(['currentUser', 'currentChannel', 'isPrivate'])
  },
  watch: {
    isPrivate () {
      if (!this.isPrivate) {
        this.resetNotifications()
      }
    }
  },
  methods: {
    addListeners () {
      this.usersRef.on('child_added', (snapshot) => {
        if (this.currentUser.uid !== snapshot.key) {
          const user = snapshot.val()
          user.uid = snapshot.key
          user.status = 'offline'
          this.users.push(user)
        }
      })

      this.presenceRef.on('child_added', snapshot => {
        if (this.currentUser.uid !== snapshot.key) {
          this.addStatusToUser(snapshot.key)
          const channelId = this.getChannelId(snapshot.key)
          this.privateMessagesRef.child(channelId).on('value', snapshot => {
            this.handleNotifications(channelId, this.currentChannel.id, this.notifCount, snapshot)
          })
        }
      })

      this.presenceRef.on('child_removed', snapshot => {
        if (this.currentUser.uid !== snapshot.key) {
          this.addStatusToUser(snapshot.key, false)
          this.privateMessagesRef.child(this.getChannelId(snapshot.key)).off()
        }
      })

      this.connectedRef.on('value', snapshot => {
        if (snapshot.val() === true) {
          const ref = this.presenceRef.child(this.currentUser.uid)
          ref.set(true)
          ref.onDisconnect().remove()
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
      return user.status === 'online'
    },
    getNotification (user) {
      const channelId = this.getChannelId(user.uid)
      let notif = 0
      this.notifCount.forEach(el => {
        if (el.id === channelId) {
          notif = el.notif
        }
      })
      return notif
    },
    resetNotifications (user = null) {
      let channelId = null
      if (user !== null) {
        channelId = this.getChannelId(user.uid)
      } else {
        channelId = this.channel.id
      }

      const index = this.notifCount.findIndex(el => el.id === channelId)
      if (index !== -1) {
        this.notifCount[index].total = this.notifCount[index].lastKnownTotal
        this.notifCount[index].notif = 0
      }
    },
    detachListeners () {
      this.usersRef.off()
      this.presenceRef.off()
      this.connectedRef.off()

      this.channels.forEach(el => {
        this.messagesRef.child(el.id).off()
      })
    },
    // 切換頻道
    changeChannel (user) {
      if (this.channel === null) {
        this.resetNotifications(user)
      } else {
        this.resetNotifications()
      }
      // 轉換頻道
      const channelId = this.getChannelId(user.uid)
      const channel = { id: channelId, name: user.name }
      this.channel = channel
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
