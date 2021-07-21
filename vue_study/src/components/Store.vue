<template>
  <div class="store">
    <p @click="$store.commit('add')">{{$store.state.count}}</p>
    <p @click="$store.dispatch('add')">{{$store.state.count}}</p>
    <p>{{$store.getters.doubleCounter}}</p>
  </div>
</template>

<script>
  export default {
    name: "Store"
  }
</script>

<style scoped>

</style>
