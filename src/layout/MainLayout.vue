<script setup>

import TopBar from "@/layout/TopBar.vue";
</script>

<template>
  <div class="w-full h-full px-64 py-8">
    <TopBar class="mb-8"/>
    <router-view/>
  </div>
</template>

<style scoped>

</style>