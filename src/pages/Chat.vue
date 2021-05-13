<template>
  <div>
      <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="#4a154b" dark>
      <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
      </v-toolbar-title>
      <v-text-field flat solo-inverted hide-details prepend-inner-icon="mdi-magnify" label="Search" class="hidden-sm-and-down"></v-text-field>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-clock</v-icon>
      </v-btn>
    </v-app-bar>
    <v-container justify="center" class="" fluid permanent>
      <v-row >
        <Sidebar/>
        <Messages/>
      </v-row>
    </v-container>
  </div>
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
