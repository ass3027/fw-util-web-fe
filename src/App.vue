<script setup>
</script>

<template>
  <div class="flex flex-col w-full h-full">
    <Toast position="top-center" :pt="{ messageContent: { class: 'flex items-center' } }"/>
    <router-view />
  </div>
</template>
