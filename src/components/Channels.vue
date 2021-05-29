<template>
    <span>
      <v-list-item class="d-flex" v-for="channel in channels" :key="channel.id" @click="changeChannel(channel)">
        <v-list-item-icon  >
          <v-icon class="white--text ">mdi-pound</v-icon>
        </v-list-item-icon>

        <v-list-item-content inline>
          <v-list-item-title class="white--text" >{{ channel.name }}</v-list-item-title>
        </v-list-item-content>

        <v-badge class="white--text ml-1 align-items-center" color="red"  style="zindex: 100;" v-if="getNotification(channel) > 0 && channel.id !== currentChannel.id"></v-badge>
        <v-badge class="white--text " color="transparent" style="inset: auto; top: -5px;right: -1px;" v-if="getNotification(channel) > 0 && channel.id !== currentChannel.id">{{ getNotification(channel)}}</v-badge>
      </v-list-item>
    </span>
</template>

<script>
import firebase from 'firebase'
import { mapGetters } from 'vuex'

export default {
  name: 'channels',
  data () {
    return {
      new_channel: '',
      errors: [],
      channelsRef: firebase.database().ref('channels'),
      messagesRef: firebase.database().ref('messages'),
      notifCount: [],
      channels: [],
      channel: null
    }
  },
  computed: {
    ...mapGetters(['currentChannel', 'isPrivate'])
  },
  watch: {
    isPrivate () {
      if (this.isPrivate) {
        this.resetNotifications()
      }
    }
  },
  methods: {
    addChannel () {
      this.errors = []
      const key = this.channelsRef.push().key

      const newChannel = { id: key, name: this.new_channel }
      this.channelsRef.child(key).update(newChannel)
        .then(() => {
          this.$store.dispatch('setCurrentChannel', newChannel)
          this.new_channel = ''
        })
        .catch((error) => {
          this.errors.push(error.message)
        })
    },
    addListeners () {
      this.channelsRef.on('child_added', snapshot => {
        this.channels.push(snapshot.val())
        // 設定目前頻道
        if (this.channels.length > 0) {
          this.channel = this.channels[0]
          this.$store.dispatch('setCurrentChannel', this.channel)
        }
        this.addCountListener(snapshot.key)
      })
    },
    addCountListener (channelId) {
      this.messagesRef.child(channelId).on('value', snapshot => {
        this.handleNotifications(channelId, this.currentChannel.id, this.notifCount, snapshot)
      })
    },
    handleNotifications (channelId, currentChannelId, notifCount, snapshot) {
      // 確認頻道是否加入通知陣列
      let lastTotal = 0
      // index是符合標準的平到通知數量
      const index = notifCount.findIndex(el => el.id === channelId)
      if (index !== -1 && channelId !== currentChannelId && snapshot.numChildren() - lastTotal > 0) {
        lastTotal = notifCount[index].total

        notifCount[index].notif = snapshot.numChildren() - lastTotal

        // 取遠端資料
        notifCount[index].lastKnownTotal = snapshot.numChildren()// 頻道裡面的第幾個訊息
        console.log(notifCount)
        console.log(snapshot.numChildren())
        console.log()
      } else {
        notifCount.push({
          // 加入到通知陣列中
          id: channelId,
          total: snapshot.numChildren(),
          lastKnownTotal: snapshot.numChildren(),
          notif: 0
        })
      }
    },
    getNotification (channel) {
      let notif = 0
      this.notifCount.forEach(el => {
        if (el.id === channel.id) {
          notif = el.notif
        }
      })
      return notif
    },
    // 目前頻道
    setActiveChannel (channel) {
      return channel.id === this.currentChannel.id
    },
    changeChannel (channel) {
      // 重新設定通知
      this.resetNotifications()
      // 更新頻道資訊
      this.$store.dispatch('setPrivate', false)
      this.$store.dispatch('setCurrentChannel', channel)
      this.channel = channel
    },
    // 通知歸0
    resetNotifications () {
      const index = this.notifCount.findIndex(el => el.id === this.channel.id)
      if (index !== -1) {
        this.notifCount[index].total = this.notifCount[index].lastKnownTotal
        this.notifCount[index].notif = 0
      }
    },
    detachListeners () {
      // 要注意的是在元件離開使用的時候要記得加上一個off事件把 firebase connect的方法移除
      this.channelsRef.off()
      this.channels.forEach(el => {
        this.messagesRef.child(el.id).off()
      })
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
