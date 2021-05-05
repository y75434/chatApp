<template>
  <div>
    <!-- Modal -->
    <div class="modal fade" id="fileModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">上傳檔案</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form class="form">
              <div class="form-group">
                <input @change="addFile" type="file" id="file" name="file" class="form-control">
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button @click="sendFile" type="button" class="btn btn-primary">傳送檔案</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import mime from 'mime-types'
import $ from 'jquery'

export default {
  name: 'file-modal',
  data () {
    return {
      file: null,
      authorized: ['image/jpeg', 'image/jpg', 'image/png']
    }
  },
  computed: {
    ...mapGetters(['currentChannel', 'currentUser', 'isPrivate'])
  },
  methods: {
    isValid (filename) {
      const index = this.authorized.indexOf(mime.lookup(filename))
      return index !== -1
    },
    addFile (e) {
      const files = e.target.files
      if (files.length === 1) {
        this.file = files[0]
      }
    },
    // sendFile () {
    //   if (this.file !== null) {
    //     if (this.isValid(this.file.name)) {
    //       const metadata = { contentType: mime.lookup(this.file.name) }
    //       this.$parent.uploadFile(this.file, metadata)
    //       $('#fileModal').modal('hide')
    //     }
    //   }
    // },
    sendFile () {
      this.$parent.uploadFile(this.file)
      $('#fileModal').modal('hide')
    },
    resetForm () {
      $('.form').trigger('reset')
      this.file = null
    }
  }
}
</script>
