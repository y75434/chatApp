<template>
    <v-navigation-drawer permanent fluid color="#4a154b">
      <v-list >
        <v-list-item>
          <v-list-item-avatar>
            <v-img :src="currentUser.photoURL"></v-img>
          </v-list-item-avatar>
        </v-list-item>
        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title class="title white--text">
              {{ currentUser.displayName }}
            </v-list-item-title>
            <button @click="logout" class="btn btn-light">登出</button>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list nav dense>
        <v-list-item-group v-model="selectedItem" >
          <v-list-item v-for="(item, i) in items" :key="i" >
            <v-list-item-icon>
              <v-icon v-text="item.icon" class="white--text"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.text" class="white--text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item  @click="openModal()" link>
            <v-list-item-icon>
              <v-icon class="white--text">mdi-plus</v-icon>
            </v-list-item-icon>
            <v-list-item-content >
              <v-list-item-title class="white--text">Add Channel</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item link @click.native="modal = true">
                <v-list-item-icon>
                  <v-icon class="white--text">mdi-plus</v-icon>
                </v-list-item-icon>
                <v-list-item-content >
                  <v-list-item-title class="white--text">test</v-list-item-title>
                </v-list-item-content>
                <!-- modal -->
                <template v-if="modal = true">
                  <div class="text-center" >
                    <v-dialog  width="500">
                      <!-- <template v-slot:activator="{ on, attrs }"> -->
                        <!-- <v-btn color="red lighten-2" dark v-bind="attrs" v-on="on"> Click Me</v-btn> -->
                      <!-- </template> -->
                      <v-card>
                        <v-card-title class="headline grey lighten-2">輸入頻道名稱</v-card-title>
                        <v-card-text >
                          <v-text-field placeholder="Channel name"></v-text-field>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="primary" text @click="closeModal">取消</v-btn>
                          <v-btn color="info" text @click="addChannel">新增頻道</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </div>
                </template>
          </v-list-item>
          <Channels/>
          <Users/>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
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
      presenceRef: firebase.database().ref('presence'),
      selectedItem: 0,
      items: [
        { text: 'My Files', icon: 'mdi-folder' },
        { text: 'Starred', icon: 'mdi-star' },
        { text: 'Recent', icon: 'mdi-history' },
        { text: 'Offline', icon: 'mdi-check-circle' },
        { text: 'Uploads', icon: 'mdi-upload' },
        { text: 'Backups', icon: 'mdi-cloud-upload' }
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
    openModal () {
      $('#channelModal').modal('show')
    },
    closeModal () {
      $('#channelModal').modal('hide')
    },
    logout () {
      this.presenceRef.child(this.currentUser.uid).remove()
      firebase.auth().signOut()
      this.$store.dispatch('setUser', null)
      this.$router.push('/login')
    }
  }
}
</script>
