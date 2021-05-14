<template>

  <div>
    <v-list-item v-for="user in users" :key="user.id" @click.prevent="changeChannel(user)">
      <v-list-item-avatar>
        <v-img :src="user.avatar" class="tile" ></v-img>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="white--text">{{ user.name }}</v-list-item-title>
      </v-list-item-content>
      <v-badge class="white--text ml-2" color="red" v-if="getNotification(user) >= 1" ></v-badge>
      <v-badge class="white--text " color="transparent" style="inset: auto; top: -5px;right: -1px;" v-if="getNotification(user) >= 1">{{ getNotification(user)}}</v-badge>
    </v-list-item>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import mixin from '../mixins'
import firebase from 'firebase'

export default {
  name: 'users',
  data () {
    return {
      users: [],
      usersRef: firebase.database().ref('users'),
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
        // 顯示除了自己以外的用戶
        if (this.currentUser.uid !== snapshot.key) {
          const user = snapshot.val()
          user.uid = snapshot.key
          this.users.push(user)
        }
      })

      this.presenceRef.on('child_added', snapshot => {
        if (this.currentUser.uid !== snapshot.key) {
          // this.addStatusToUser(snapshot.key)
          const channelId = this.getChannelId(snapshot.key)
          this.privateMessagesRef.child(channelId).on('value', snapshot => {
            this.handleNotifications(channelId, this.currentChannel.id, this.notifCount, snapshot)
          })
        }
      })

      this.presenceRef.on('child_removed', snapshot => {
        if (this.currentUser.uid !== snapshot.key) {
          // this.addStatusToUser(snapshot.key, false)
          this.privateMessagesRef.child(this.getChannelId(snapshot.key)).off()
        }
      })
    },
    // 計算有幾個通知
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
      // this.presenceRef.off()

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
      // 到私人訊息頁
      this.$store.dispatch('setPrivate', true)
      this.$store.dispatch('setCurrentChannel', channel)
    },
    isActive (user) {
      const channelId = this.getChannelId(user.uid)
      return this.currentChannel.id === channelId
    },
    // 我不懂這行要幹嘛
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
