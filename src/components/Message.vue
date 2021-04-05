<template>
  <div>
    <SingleMessage :messages="messages">
    <MessageForm>
  </div>
</template>

<script>
import SingleMessage from './SingleMessage'
import MessageForm from './MessageForm'
import database from 'firebase/database'
import { mapGetters } from 'vuex'

export default {
  name: 'messages',
  components: { SingleMessage, MessageForm },
  data () {
    return {
      messagesRef: firebase.database().ref('messages'),
      messages: [],
      channel: ''
    }
  },
  computed: {
    ...mapGetters(['currentChannel'])
  },
  watch: {
    // 轉換目前頻道
    currentChannel: function () {
      this.messages = []
      this.addListeners()
      this.channel = this.currentChannel
    }
  },
  methods: {
    addListeners () {
      this.messagesRef.child(this.currentChannel.id).on('child_added', (snapshot) => {
        this.messages.push(snapshot.val())

        // 移動到最上層
        this.$nextTick(() => {
          $('html, body').scrollTop($(document).height())
        })
      })
    },
    detachListeners () {
      if (this.channel !== null) {
        this.messagesRef.child(this.channel.id).off()
      }
    },
    beforeDestroy () {
      this.detachListeners()
    }
  }
}
</script>
