<template>
  <v-col cols="12" sm="8" md="8" class="py-0 " style=" margin-left: 300px;">
    <v-container >
      <v-app-bar color="deep-white accent-4" style="z-index:10" dense>
        <v-toolbar-title><v-icon>mdi-pound</v-icon>{{ channelName }}</v-toolbar-title>
          <v-btn icon><v-icon>mdi-star-outline</v-icon></v-btn>
            <v-spacer></v-spacer>
      </v-app-bar>
      <SingleMessage :messages="messages" style="overflow-y: auto; height:70vh"></SingleMessage>
      <MessageForm/>
    </v-container>

  </v-col>
</template>

<script>
import SingleMessage from './SingleMessage'
import MessageForm from './MessageForm'
import { mapGetters } from 'vuex'
import firebase from 'firebase'

export default {
  name: 'messages',
  components: { SingleMessage, MessageForm },
  data () {
    return {
      messagesRef: firebase.database().ref('messages'),
      privateMessagesRef: firebase.database().ref('privateMessages'),
      messages: [],
      channel: null,
      listeners: []
    }
  },
  computed: {
    ...mapGetters(['currentChannel', 'currentUser', 'isPrivate']),
    channelName () {
      if (this.channel !== null) {
        return this.channel.name
      } else {
        return 'Welcome'
      }
    }
  },
  watch: {
    // 轉換目前頻道
    currentChannel () {
      this.detachListeners()
      this.addListeners()
      this.channel = this.currentChannel
    }
  },
  methods: {
    addListeners () {
      // 監聽目前在哪個頁面
      const ref = this.getMessagesRef()
      // on(隨時監聽
      ref.child(this.currentChannel.id).on('child_added', (snapshot) => {
        const message = snapshot.val()
        message.id = snapshot.key
        this.messages.push(message)
        // 移動到最上層
        this.$nextTick(() => {
          $('html, body').scrollTop($(document).height())
        })
      })
      // 傳送參數到事件
      this.addToListeners(this.currentChannel.id, ref, 'child_added')
    },
    addToListeners (id, ref, event) {
      const index = this.listeners.findIndex(el => {
        return el.id === id && el.ref === ref && el.event === event
      })
      if (index === -1) {
        this.listeners.push({ id: id, ref: ref, event: event })
      }
    },
    detachListeners () {
      this.listeners.forEach(listener => {
        listener.ref.child(listener.id).off(listener.event)
      })
      this.listeners = []
      this.messages = []
    },
    // 在群組還是在私人訊息
    getMessagesRef  () {
      if (this.isPrivate) {
        return this.privateMessagesRef
      } else {
        return this.messagesRef
      }
    },
    beforeDestroy () {
      this.detachListeners()
    }
  }
}
</script>
