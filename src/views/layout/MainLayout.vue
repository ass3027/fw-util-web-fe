<script setup>

import TopBar from "@/views/layout/TopBar.vue";
</script>

<template>
  <div class="w-full h-full flex flex-col px-64 py-8">
    <TopBar class="mb-8"/>
    <router-view class="flex-1 min-h-0"/>
  </div>
</template>

<style scoped>

</style>