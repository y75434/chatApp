<template>
    <span>
      <v-list-item class="d-flex" v-for="channel in channels" :key="channel.id" @click="changeChannel(channel)">
        <v-list-item-icon  >
          <v-icon class="white--text ">mdi-pound</v-icon>
        </v-list-item-icon>

        <v-list-item-content inline>
          <v-list-item-title class="white--text" >{{ channel.name }}</v-list-item-title>
        </v-list-item-content>

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
      })
    },
    // 目前頻道
    setActiveChannel (channel) {
      return channel.id === this.currentChannel.id
    },
    changeChannel (channel) {
      // 更新頻道資訊
      this.$store.dispatch('setPrivate', false)
      this.$store.dispatch('setCurrentChannel', channel)
      this.channel = channel
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
