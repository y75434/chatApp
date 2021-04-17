<template>
  <div>
    <!-- Button trigger modal -->
    <button @click="openModal" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
      新增頻道
    </button>

    <div class="mt-4">
      <button v-for="channel in channels" :key="channel.id" class="list-group-item list-group-item-action" type="button" :class="{'active': setActiveChannel(channel)}" @click="changeChannel(channel)">{{ channel.name }}</button>
      <span v-if="getNotification(channel) > 0 && channel.id !== currentChannel.id" class="float-right">{{ getNotification(channel) }}</span>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="channelModal" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
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
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
            <button ＠click="addChannel" type="button" class="btn btn-primary">新增頻道</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import database from 'firebase/database'
import { mapGetters } from 'vuex'
import mixin from '../mixins'
import $ from 'jquery'

export default {
  name: 'channels',
  data () {
    return {
      new_channel: '',
      errors: [],
      channelsRef: database().ref('channels'),
      messagesRef: database().ref('messages'),
      notifCount: [],
      channels: [],
      channel: null
    }
  },
  mixins: [mixin],
  computed: {
    ...mapGetters(['currentChannel', 'isPrivate']),
    hasErrors () {
      return this.errors.length > 0
    }
  },
  watch: {
    isPrivate () {
      if (this.isPrivate) {
        this.resetNotifications()
      }
    }
  },
  methods: {
    openModal () {
      $('#channelModal').appendTo('body').modal('show')
    },
    addChannel () {
      this.errors = []
      const key = this.channelsRef.push().key
      const newChannel = { id: key, name: this.new_channel }
      this.channelsRef.child(key).update(newChannel)
        .then(() => {
          this.$store.dispatch('setCurrentChannel', newChannel)
          this.new_channel = ''
          $('#channelModal').modal('hide')
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
        this.addCountListener(snapshot.key)
      })
    },
    addCountListener (channelId) {
      this.messagesRef.child(channelId).on('value', snapshot => {
        this.handleNotifications(channelId, this.currentChannel.id, this.notifCount, snapshot)
      })
    },
    getNotification (channel) {
      let notif = 0
      this.notifCount.forEach(el => {
        if (el.id === channel.id) {
          notif = el.notif
        }
      })
      return notif
    },

    setActiveChannel (channel) {
      return channel.id === this.currentChannel.id
    },
    changeChannel (channel) {
      // 重新設定通知
      this.resetNotifications()
      this.$store.dispatch('setPrivate', false)
      this.$store.dispatch('setCurrentChannel', channel)
      this.channel = channel
    },
    resetNotifications () {
      const index = this.notifCount.findIndex(el => el.id === this.channel.id)
      if (index !== -1) {
        this.notifCount[index].total = this.notifCount[index].lastKnownTotal
        this.notifCount[index].notif = 0
      }
    },
    detachListeners () {
      this.channelsRef.off()
      this.channel.forEach(el => {
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
