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
            <button @click.prevent="openFileModal" class="btn btn-warning mt-3" type="button">選擇照片</button>
          </div>
        </div>
      </form>
      <file-modal ref="file_modal"></file-modal>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import FileModal from './FileModal'
import firebase from 'firebase'
import $ from 'jquery'

export default {
  name: 'message-form',
  components: { FileModal },
  data () {
    return {
      message: '',
      errors: [],
      storageRef: firebase.storage().ref(),
      messagesRef: firebase.database().ref('messages'),
      privateMessagesRef: firebase.database().ref('privateMessages'),
      uploadTask: null,
      uploadState: null,
      image: null,
      imageURL: ''
    }
  },
  computed: {
    ...mapGetters(['currentChannel', 'currentUser', 'isPrivate'])
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

      if (this.currentChannel !== null && this.message.length > 0) {
        if (this.isPrivate) {
          this.privateMessagesRef.child(this.currentChannel.id).push().set(newMessage)
        } else {
          this.messagesRef.child(this.currentChannel.id).push().set(newMessage)
        }
        this.message = ''
      }
    },
    sentPhoto (fileUrl) {
      const photoMessage = {
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        user: {
          name: this.currentUser.displayName,
          avatar: this.currentUser.photoURL,
          id: this.currentUser.uid
        }
      }
      photoMessage.image = fileUrl

      if (this.currentChannel !== null) {
        if (this.isPrivate) {
          this.privateMessagesRef.child(this.currentChannel.id).push().set(photoMessage)
        } else {
          this.messagesRef.child(this.currentChannel.id).push().set(photoMessage)
        }
        this.photoMessage = ''
      }
    },
    uploadFile (file) {
      if (file === null) return false
      const pathToUpload = this.currentChannel.id
      const ref = this.getMessagesRef()
      // 路徑
      const filePath = this.getPath() + '/' + '.jpg'

      this.uploadTask = this.storageRef.child(filePath).put(file)
      this.uploadState = 'uploading'
      // recover the url of file
      this.uploadTask.snapshot.ref.getDownloadURL().then(fileUrl => {
        this.sendFileMessage(fileUrl, ref, pathToUpload)
      })
      this.$refs.file_modal.resetForm()
    },
    sendFileMessage (fileUrl, ref, pathToUpload) {
      ref.child(pathToUpload).push().set(this.sentPhoto(fileUrl)).then(() => {
        this.$nextTick(() => {
          $('html, body').scrollTop($(document).height())
        })
      }).catch(error => {
        this.errors.push(error.message)
      })
    },
    getPath () {
      if (this.isPrivate) {
        return 'chat/private/' + this.currentChannel.id
      } else {
        return 'chat/public'
      }
    },
    openFileModal () {
      $('#fileModal').modal('show')
    },
    // 在群組還是在私人訊息
    getMessagesRef  () {
      if (this.isPrivate) {
        return this.privateMessagesRef
      } else {
        return this.messagesRef
      }
    }
  },
  mounted () {
    $('html, body').scrollTop($(document).height())
  },
  beforeDestroy () {
    if (this.uploadTask !== null) {
      this.uploadTask.cancel()
      this.uploadTask = null
    }
  }
}
</script>
