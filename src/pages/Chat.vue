<template>
  <!-- <v-container class="fill-height" fluid permanent>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="4" md="4">
        <Sidebar/>
      </v-col>
      <v-col cols="12" sm="8" md="8" >
        <Messages/>
      </v-col>
    </v-row>
  </v-container> -->

  <!-- <v-container>
    <v-row class="text-center">
      <v-app-bar color="deep-white accent-4" dense>
        <v-toolbar-title>Home page</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>mdi-heart</v-icon>
        </v-btn>
      </v-app-bar>
      <v-col cols="12"></v-col>
      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">Welcome to Slack clone</h1>
        <p class="subheading font-weight-regular"> This slack clone was built with Vue js and Firebase to realtime chat.</p>
      </v-col>
      <v-col class="mb-5" cols="12"></v-col>
        </v-row>
  </v-container> -->

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
    <v-container class="fill-height" fluid permanent>
      <v-row align="center" justify="center">
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
