<template>
  <div class="home">
    this is home compo
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <store></store>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import Store from '@/components/Store.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld,
    Store
  }
}
</script>
