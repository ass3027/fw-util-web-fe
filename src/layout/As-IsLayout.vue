<script setup lang="ts">
import SideBar from "@/layout/SideBar.vue";
import RegionSelectComponent from "@/layout/RegionSelectComponent.vue";
</script>

<template>
  <div class="flex flex-col w-full items-center ">
    <header class="flex w-3/5 h-1/5 justify-between items-center">
      <img class="h-2/3 w-1/8 m-8" alt="Vue logo" src="@/assets/logo.svg"/>
      <RegionSelectComponent class="mx-10"/>
    </header>

    <Divider/>

    <div class="flex justify-center w-7/9 h-4/5">
      <div class="w-3/20">
        <SideBar/>
      </div>
      <div class="flex flex-auto px-10">
        <Panel class="flex-auto overflow-auto">
          <router-view />
        </Panel>
      </div>
      <div class="w-1/20"></div>
    </div>
  </div>
</template>

<style scoped>

</style>