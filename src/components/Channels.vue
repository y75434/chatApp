<template>
    <!-- <div class="mt-4">
      <button v-for="channel in channels" :key="channel.id" class="list-group-item list-group-item-action" type="button" :class="{'active': setActiveChannel(channel)}" @click="changeChannel(channel)">{{ channel.name }}</button>
      <span v-if="getNotification(channel) > 0 && channel.id !== currentChannel.id" class="float-right">{{ getNotification(channel) }}</span>
    </div> -->

    <v-card class="mx-auto">
      <v-list>
        <v-list-item-group color="primary">
          <v-list-item v-for="channel in channels" :key="channel.id" @click="changeChannel(channel)">
            <v-list-item-content>
              <v-list-item-title>{{ channel.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>

</template>

<script>
import firebase from 'firebase'
import { mapGetters } from 'vuex'
import mixin from '../mixins'

export default {
  name: 'channels',
  data () {
    return {
      new_channel: '',
      errors: [],
      channelsRef: firebase.database().ref('channels'),
      messagesRef: firebase.database().ref('messages'),
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
    addChannel () {
      this.errors = []
      const key = this.channelsRef.push().key
      const newChannel = { id: key, name: this.new_channel }
      console.log(newChannel)
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
      // 更新頻道資訊
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
