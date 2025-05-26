<script setup>
const toggleDarkMode = () => document.documentElement.classList.toggle('my-app-dark')
</script>

<template>
  <div class="flex flex-col w-full h-full">
    <div class="flex justify-end">
      <Button label="Dark Mode" @click="toggleDarkMode()" />
    </div>
    <router-view />
  </div>
</template>
