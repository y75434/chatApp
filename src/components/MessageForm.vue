<template>
  <div>
    <div class="messageform">
      <form @submit.prevent="sendMessage">
        <div class="input-group mb-3">
          <input v-model.trim="message" name="message" id="message" class="form-control mt-3" placeholder="請輸入">
          <div class="input-group-append">
            <button @click="sendMessage" class="btn btn-primary mt-3" type="button">傳送</button>
          </div>
          <div class="input-group-append">
            <button class="btn btn-warning mt-3" type="button">更新</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'message-form',
  data () {
    return {
      message: '',
      errors: []
    }
  },
  computed: {
    ...mapGetters(['currentChannel', 'currentUser'])
  },
  methods: {
    sendMessage () {
      const newMessage = {
        content: this.message,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        user: {
          name: this.currentUser.displayName,
          avatar: this.currentUser.photoURL,
          id: this.currentUser.uid
        }
      }
      // 驗證
      if (this.currentChannel !== null) {
        if (this.message.length > 0) {
          this.$parent.messagesRef.child(this.currentChannel.id).push().set(newMessage)
            .then(() => {
              this.$nextTick(() => {
                $('html, body').scrollTop($(document).height())
              })
            }).catch((error) => {
              this.errors.push(error.message)
            })
            this.message = ''
        }
      }
    }
  }
}
</script>
