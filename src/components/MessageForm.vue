<template>
  <div>
    <div class="messageform">
      <!-- <form @submit.prevent="sendMessage">
        <div class="input-group mb-3">
          <input v-model.trim="message" name="message" id="message" class="form-control mt-3" placeholder="請輸入">
          <div class="input-group-append">
            <button @click="sendMessage" class="btn btn-primary mt-3" type="button">傳送</button>
          </div>
          <div class="input-group-append">
            <button @click.prevent="openFileModal" class="btn btn-warning mt-3" type="button">選擇照片</button>
          </div>
        </div>
      </form> -->
      <v-btn color="blue-grey" class="ma-2 white--text" fab @click="modal = true">
        <v-icon dark>
          mdi-cloud-upload
        </v-icon>
      </v-btn>
      <!-- modal -->
      <template>
        <div class="text-center" >
          <v-dialog  width="500" v-model = "modal">
            <v-card>
              <v-card-title class="headline grey lighten-2">上傳檔案</v-card-title>
              <v-btn color="primary" link @click.prevent="openFileModal">選擇照片</v-btn>
              <v-card-text >
                <v-text-field placeholder="Channel name"></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" link @change="addFile">取消</v-btn>
                <v-btn color="info" link @click="sendFile">傳送檔案</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </template>

      <file-modal ref="file_modal"></file-modal>

      <div class="footer">
        <v-footer>
          <v-col cols="12">
            <v-text-field filled clear-icon="mdi-close-circle" clearable placeholder="請輸入" type="text" v-model="message"  v-on:keyup.enter="sendMessage"></v-text-field>
                </v-col>
        </v-footer>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import firebase from 'firebase'
import $ from 'jquery'
import { v4 as uuidv4 } from 'uuid'
import FileModal from './FileModal'

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
      modal: false

      // image: null,
      // imageURL: ''
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
    sendPhoto (fileUrl) {
      const photoMessage = {
        content: null,
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
        this.fileUrl = ''
      }
    },
    uploadFile (file, metadata) {
      if (file === null) return false
      const pathToUpload = this.currentChannel.id

      const ref = this.getMessagesRef()
      // 取名稱
      const filePath = this.getPath() + '/' + uuidv4() + '.jpg'
      this.uploadTask = this.storageRef.child(filePath).put(file, metadata)

      this.uploadTask.on('state_changed', snapshot => {
      }, error => {
        // error
        this.errors.push(error.message)

        this.uploadTask = null
        // reset form
        this.$refs.file_modal.resetForm()
      }, () => {
        // reset form
        this.$refs.file_modal.resetForm()
        // recover the url of file
        this.uploadTask.snapshot.ref.getDownloadURL().then(fileUrl => {
          this.sendFileMessage(fileUrl, ref, pathToUpload)
        })
      })
    },
    sendFileMessage (fileUrl, ref, pathToUpload) {
      ref.child(pathToUpload).push().set(this.sendPhoto(fileUrl)).then(() => {
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
      // $('#fileModal').modal('show')
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
