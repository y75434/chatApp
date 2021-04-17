<template>
  <div>
    <!-- Modal -->
    <div class="modal fade" id="fileModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
            <button ＠click="sendFile" type="button" class="btn btn-primary">傳送檔案</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mine from 'mine-types'

export default {
  name: 'file-modal',
  data () {
    return {
      file: null,
      authorized: ['image/jpeg', 'image/jpg', 'image/png']
    }
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
    sendFile () {
      if (this.file !== null) {
        if (this.isValid(this.file.name)) {
          const metadata = { contentType: mine.lookup(this.file.name) }
          this.$parent.uploadFile(this.file, metadata)
          $('#fileModal').modal('hide')
        }
      }
    },
    resetForm () {
      $('.form').trigger('reset')
      this.file = null
    }
  }
}
</script>
