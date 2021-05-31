<template>
  <div>
    <v-app-bar  app color="#4a154b" dark style="z-index:12;">
      <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
      </v-toolbar-title>
      <v-text-field flat solo-inverted hide-details prepend-inner-icon="mdi-magnify" label="Search" class="hidden-sm-and-down"></v-text-field>
      <v-spacer></v-spacer>
      <v-btn icon><v-icon>mdi-clock</v-icon></v-btn>
    </v-app-bar>
    <v-container class="" fluid permanent>
      <v-row >
        <v-col style="overflow-y: auto; height: 100vh;" class="d-sm-none d-md-flex p-0" col='4'  md="4" lg="4">
          <Sidebar/>
        </v-col>
        <v-col class="p-0" sm="12" md="8" lg="8">
          <Messages/>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import Sidebar from '../components/Sidebar'
import Messages from '../components/Messages'
// import FileModal from '../components/FileModal.vue'

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
