<template>
  <div >
    <v-col v-for="message in messages" :key="message.id" cols="12" sm="12" md="8"  v-chat-scroll>
      <v-card class="fill-height">
        <v-list-item three-line>
            <v-list-item-avatar size="50px" item>
              <v-img :src="message.user.avatar" alt="Avatar"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
                <div><strong>{{message.user.name}} </strong> <span style="color:gray; font-size:12px"> {{ message.timestamp | fromNow }}</span> </div>
                <v-list-item-subtitle v-if="!isFile(message)" style="font-size:20px;color:black">{{message.content}}</v-list-item-subtitle>
                <v-list-item-subtitle v-else style="font-size:20px;color:black">
                    <v-img  :src="message.image" />
                </v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-col>

  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'

export default {
  name: 'single-message',
  props: ['messages'],
  computed: {
    ...mapGetters(['currentUser'])
  },
  methods: {
    // selfMessage (user) {
    //   return user.id === this.currentUser.uid
    // },
    // 有檔案就沒有文字
    isFile (message) {
      return message.content == null
    }
  },
  filters: {
    // 設定現在時間
    fromNow (value) {
      return moment(value).format('MMMM Do YYYY, h:mm:ss a')
    }
  }
}
</script>

<style scoped>
    /* .self_message {
        border-left: 5px solid red;
        padding: 0 10px;
    } */
    .v-sheet.v-card:not(.v-sheet--outlined) {
    box-shadow: none;
    }
</style>
