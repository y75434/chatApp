<template>
  <v-card class="" tile>
      <v-navigation-drawer permanent height="100%">
        <v-system-bar>
        </v-system-bar>
        <v-list>
          <v-list-item>
            <v-list-item-avatar>
              <v-img :src="currentUser.photoURL"></v-img>
            </v-list-item-avatar>
          </v-list-item>
          <v-list-item link>
            <v-list-item-content>
              <v-list-item-title class="title">
                {{ currentUser.displayName }}
              </v-list-item-title>
              <button @click="logout" class="btn btn-light">登出</button>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list nav dense>
          <v-list-item-group v-model="selectedItem" color="primary">
            <v-list-item v-for="(item, i) in items" :key="i" >
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.text"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item link>
              <v-list-item-icon>
                <v-icon class="">mdi-plus</v-icon>
              </v-list-item-icon>
              <v-list-item-content >
                <v-list-item-title >Add Channel</v-list-item-title>
              </v-list-item-content>
              <!-- Button trigger modal -->
              <button @click="openModal()" type="button" class="btn btn-primary" >
                新增頻道
              </button>
              <!-- Modal -->
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
            </v-list-item>
            <Channels/>
            <Users/>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
  </v-card>
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
      ]
    }
  },
  computed: {
    ...mapGetters(['currentUser'])
  },
  methods: {
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
