<template>
  <div class="modal fade" id="channelModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Modal title</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form>
            <div class="form-group">
              <input v-model="new_channel" type="text" id="new_channel" name="new_channel" placeholder="Channel name" class="form-control">
            </div>
            <ul class="list-group" v-if="hasErrors">
              <li class="list-group-item text-danger" v-for="error in errors" :key="error.id">{{ error }}</li>
            </ul>
          </form>
        </div>
        <div class="modal-footer">
          <button @click="closeModal" type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
          <button @click="addChannel" type="button" class="btn btn-primary">新增頻道</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'channelModal',
  methods: {
    showAlert (msg) {
      alert(msg)
    },
    stopAlertBus () {
      // 停止監聽
      this.$bus.$off('alert:message')
    }
  },
  created () {
    this.$bus.$on('alert:message', msg => {
      this.showAlert(msg)
    })
    this.$bus.$on('stopAlertBus', () => {
      this.stopAlertBus()
    })
    // 只監聽一次
    this.$bus.$once('onceBus', () => {
      console.log('I only execute once')
    })
  },
  beforeDestroy: function () {
    this.$bus.$off('alert:message')
  }
}
</script>
