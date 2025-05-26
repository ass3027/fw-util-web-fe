<script setup>
import RealTimeView from "@/views/RealTimeView.vue";
import { ref } from 'vue';

const showRealTimeView = ref(false);
</script>

<template>
  <div class="flex flex-col w-full h-full">
    <nav class="flex flex-col">
      <router-link to="/db-data-list" class="text-xl font-bold">DBDataList</router-link>
      <router-link to="/connection-fail-list" class="text-xl font-bold">ConnectionFailList</router-link>
      <router-link to="" @click="showRealTimeView = true" class="text-xl font-bold">Open RealTime View</router-link>
    </nav>
    <RealTimeView v-if="showRealTimeView"  :show="showRealTimeView" @close="showRealTimeView = false" />
  </div>
</template>

<style scoped>

</style>