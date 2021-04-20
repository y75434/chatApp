<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-4 sidebar">
        <h1>44444</h1>
        <Sidebar/>
      </div>
      <div class="col-md-8 content">
        <Messages/>
      </div>
    </div>
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
