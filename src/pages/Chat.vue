<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-4 sidebar">
        <Sidebar>
      </div>
      <div class="col-md-8 content">
        <Message>
      </div>
    </div>
  </div>
</template>

<script>
import MessageForm from '../components/MessageForm.vue'
// import auth from 'firebase/auth'
// import firebase from 'firebase/app'
import Sidebar from '../components/Sidebar'
import Messages from '../messages/Messages'

export default {
  name: 'Chat',
  components: { Sidebar, MessagesMessageForm }
}
</script>

<style scoped>
 .sidebar{
   display: block;
   height: 100%;
 }
</style>
