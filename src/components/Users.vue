<template>

  <div>
    <v-list-item v-for="user in users" :key="user.id" @click.prevent="changeChannel(user)">
      <v-list-item-avatar>
        <v-img :src="user.avatar" class="tile" ></v-img>
      </v-list-item-avatar>
      <v-list-item-content >
        <v-list-item-title class="white--text">{{ user.name }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import firebase from 'firebase'

export default {
  name: 'users',
  data () {
    return {
      users: [],
      usersRef: firebase.database().ref('users'),
      privateMessagesRef: firebase.database().ref('privateMessages'),
      notifCount: [],
      channel: null
    }
  },
  computed: {
    ...mapGetters(['currentUser', 'currentChannel', 'isPrivate'])
  },
  methods: {
    addListeners () {
      this.usersRef.on('child_added', snapshot => {
        // 顯示除了自己以外的用戶
        if (this.currentUser.uid !== snapshot.key) {
          const user = snapshot.val()
          user.uid = snapshot.key
          this.users.push(user)
        }
      })
    },
    detachListeners () {
      this.usersRef.off()

      this.channels.forEach(el => {
        this.messagesRef.child(el.id).off()
      })
    },
    // 切換頻道
    changeChannel (user) {
      // 轉換頻道
      const channelId = this.getChannelId(user.uid)
      const channel = { id: channelId, name: user.name }
      this.channel = channel
      // 到私人訊息頁
      this.$store.dispatch('setPrivate', true)
      this.$store.dispatch('setCurrentChannel', channel)
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
