<template>

  <div>
    <v-list-item v-for="user in users" :key="user.id" @click.prevent="changeChannel(user)">
      <v-list-item-avatar>
        <v-img :src="user.avatar" class="tile" ></v-img>
      </v-list-item-avatar>
      <v-list-item-content >
        <v-list-item-title class="white--text">{{ user.name }}</v-list-item-title>
      </v-list-item-content>
      <v-badge class="white--text ml-1 align-items-center" color="red" v-if="getNotification(user) > 0" style="zindex: 100;"></v-badge>
      <v-badge class="white--text " color="transparent" style="inset: auto; top: -5px;right: -1px;" v-if="getNotification(user) > 0 ">{{ getNotification(user)  }}</v-badge>
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
  watch: {
    isPrivate () {
      if (!this.isPrivate) {
        this.resetNotifications()
      }
    }
  },
  created () {
    this.getNotifications()
  },
  methods: {
    addListeners () {
      this.usersRef.on('child_added', snapshot => {
        // 顯示除了自己以外的用戶
        if (this.currentUser.uid !== snapshot.key) {
          const user = snapshot.val()
          user.uid = snapshot.key
          this.users.push(user)

          //  測試
          const channelId = this.getChannelId(user.uid)
          this.privateMessagesRef.child(channelId).on('value', snapshot => {
            this.handleNotifications(channelId, this.notifCount, snapshot)
          })
        }
      })
    },

    handleNotifications (channelId, notifCount, snapshot) {
      // 確認頻道是否加入通知陣列
      let lastTotal = 0

      // index是符合標準的平到通知數量
      const index = notifCount.findIndex(el => el.id === channelId)
      if (index !== -1 && snapshot.numChildren() - lastTotal > 0) {
        // 已讀數量
        lastTotal = notifCount[index].total
        // 通知數量 = 全部數量 - 已讀數量
        notifCount[index].notif = snapshot.numChildren() - lastTotal

        // 新增最新訊息的編號
        notifCount[index].lastKnownTotal = snapshot.numChildren()// 目前頻道幾個訊息
      } else {
        notifCount.push({
          // 加入到通知陣列中
          id: channelId,
          total: snapshot.numChildren(),
          lastKnownTotal: snapshot.numChildren(),
          notif: 0
        })
        console.log('已加入')
      }
    },
    // 計算有幾個通知
    getNotification (user) {
      const channelId = this.getChannelId(user.uid)
      let notif = 0
      // 剩這裡
      // let notif =
      this.notifCount.forEach(el => {
        if (el.id === channelId) {
          notif = el.notif
          console.log(notif)
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
        console.log('歸0')
      } else {
        console.log('傳回去')
      }
    },
    detachListeners () {
      this.usersRef.off()

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
