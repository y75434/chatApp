<template>
  <div>
    <div class="messageform">
      <form @submit.prevent="sendMessage">
        <div class="input-group mb-3">
          <input v-model.trim="message" name="message" id="message" class="form-control mt-3" placeholder="請輸入">
          <div class="input-group-append">
            <button x-on:click.prevent="openFileModal" class="btn btn-primary mt-3" type="button">傳送</button>
          </div>
          <div class="input-group-append">
            <button class="btn btn-warning mt-3" :disabled="'uploadState == uploading'" type="button">更新</button>
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
import uuidV4 from 'uuidv4'
// import storage from './firebase/storage'
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
      uploadTask: null,
      uploadState: null
    }
  },
  computed: {
    ...mapGetters(['currentChannel', 'currentUser', 'isPrivate'])
    // uploadLabel () {
    //   switch (this.uploadState) {
    //     case 'uploading' : return '上傳中'
    //       break
    //     case 'error': return '發生錯誤'
    //       break
    //     case 'done': return '上傳完成'
    //       break
    //     default: return ''
    //   }
    // }
  },
  methods: {
    sendMessage () {
      // const newMessage = {
      //   content: this.message,
      //   timestamp: firebase.database.ServerValue.TIMESTAMP,
      //   user: {
      //     name: this.currentUser.displayName,
      //     avatar: this.currentUser.photoURL,
      //     id: this.currentUser.uid
      //   }
      // }
      // 驗證
      if (this.currentChannel !== null) {
        if (this.message.length > 0) {
          this.$parent.getMessagesRef.child(this.currentChannel.id).push().set(this.createMessage())
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
    },
    createMessage (fileUrl = null) {
      const message = {
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        user: {
          name: this.currentUser.displayName,
          avatar: this.currentUser.photoURL,
          id: this.currentUser.uid
        }
      }
      if (fileUrl == null) {
        message.content = this.message
      } else {
        message.image = fileUrl
      }
      return message
    },
    uploadFile (file, metadata) {
      if (file === null) return false
      // const pathToUpload = this.currentChannel.id
      // const ref = this.$parent.getMessagesRef()
      // 路徑
      const filePath = this.getPath() + '/' + uuidV4() + '.jpg'

      this.uploadTask = this.storageRef.child(filePath).put(file, metadata)
      this.uploadState = 'uploading'
      // 進度條省略
      // this.uploadState.on('state_changed', snapshot => {

      // }, error => {

      // }, () => {

      // })
      // 清空
      this.$refs.file_modal.resetForm()
      // 恢復檔案
      // const fileUrl = this.uploadTask.snapshot.ref.getDownloadURL().then(fileUrl => {
      //   this.sendFileMessage(fileUrl, ref, pathToUpload)
      // })
    },
    sendFileMessage (fileUrl, ref, pathToUpload) {
      ref.child(pathToUpload).push().set(this.createMessage(fileUrl)).then(() => {
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
