<script setup>
import RealTimeView from "@/views/RealTimeView.vue";
import { ref } from 'vue';

const showRealTimeView = ref(false);
</script>

<template>
  <div class="flex flex-col w-full h-full">
    <nav class="flex flex-col">
      <router-link to="/db-data-list">DBDataList</router-link>
      <router-link to="/connection-fail-list">ConnectionFailList</router-link>
      <router-link to="" @click="showRealTimeView = true">Open RealTime View</router-link>
    </nav>
    <RealTimeView v-if="showRealTimeView"  :show="showRealTimeView" @close="showRealTimeView = false" />
  </div>
</template>

<style scoped>

</style>