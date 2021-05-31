<template>
    <v-col class="p-0" col='12'  md="12" lg="12" >
      <v-list color="#4a154b" style="">
        <v-list-item>
          <v-list-item-avatar>
            <v-img :src="currentUser.photoURL"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="title white--text">
              {{ currentUser.displayName }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="logout" link>
            <v-list-item-icon>
              <v-icon class="white--text">mdi-check-circle</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="white--text">登出</v-list-item-title>
            </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list color="#4a154b">
        <v-list-item-group v-model="selectedItem" >
          <v-list-item v-for="(item, i) in items" :key="i" >
            <v-list-item-icon>
              <v-icon v-text="item.icon" class="white--text"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.text" class="white--text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item  @click="modal = true" link>
            <v-list-item-icon>
              <v-icon class="white--text">mdi-plus</v-icon>
            </v-list-item-icon>
            <v-list-item-content >
              <v-list-item-title class="white--text">新增頻道</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <!-- modal -->
          <template>
            <div class="text-center" >
              <v-dialog  width="500" v-model = "modal">
                <v-card>
                  <v-card-title class="headline grey lighten-2">輸入頻道名稱</v-card-title>
                  <v-card-text >
                    <v-text-field v-model="new_channel" placeholder="Channel name"></v-text-field>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" link @click="closeModal">取消</v-btn>
                    <v-btn color="info" link @click="addChannel">新增頻道</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
          </template>
          <Channels/>
          <v-list-item>
            <v-list-item-icon>
              <v-icon class="white--text">mdi-check-circle</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="white--text">私訊</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <Users/>
        </v-list-item-group>
      </v-list>
  </v-col>
</template>

<script>
import { mapGetters } from 'vuex'
import Channels from './Channels'
import Users from './Users'
import firebase from 'firebase'

export default {
  name: 'Sidebar',
  components: { Channels, Users },
  data () {
    return {
      selectedItem: 0,
      items: [
        { text: '已加星號', icon: 'mdi-star' },
        { text: '提及與回應', icon: 'mdi-history' },
        { text: '已儲存項目', icon: 'mdi-upload' }
      ],
      channelsRef: firebase.database().ref('channels'),
      errors: [],
      new_channel: '',
      modal: false

    }
  },
  computed: {
    ...mapGetters(['currentUser', 'currentChannel']),
    hasErrors () {
      return this.errors.length > 0
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
          this.modal = false
        })
        .catch((error) => {
          this.errors.push(error.message)
        })
    },
    closeModal () {
      this.modal = false
    },
    logout () {
      firebase.auth().signOut()
      this.$store.dispatch('setUser', null)
      this.$router.push('/login')
    }
  }
}
</script>
