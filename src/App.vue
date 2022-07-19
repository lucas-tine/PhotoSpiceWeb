<script setup>
import topheader from  './components/topheader.vue'
import { RouterView } from 'vue-router';
</script>

<template>
  <topheader/>
  <router-view></router-view>
</template>

<style>
.link {
  color: unset;
  text-decoration: unset;
}
.link:hover {
  color:#5f2
}
</style>
