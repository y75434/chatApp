<template>
  <v-container>
    <v-row >
      <v-col cols="12" sm="4" md="4">
        <Sidebar/>
      </v-col>
      <v-col cols="12" sm="8" md="8">
        <Messages/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Sidebar from '../components/Sidebar'
import Messages from '../components/Messages'

export default {
  name: 'Chat',
  components: { Sidebar, Messages }
}
</script>

<style scoped>
 .sidebar{
   display: block;
   height: 100%;
 }
</style>
