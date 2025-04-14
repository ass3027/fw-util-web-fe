<script setup>
import RegionSelectComponent from "@/components/layout/RegionSelectComponent.vue";
import SideBar from "@/components/layout/SideBar.vue";
</script>

<template>
  <div class="flex flex-col w-full items-center ">
    <header class="flex w-3/5 h-1/5 justify-between items-center">
      <img class="h-2/3 w-1/8 m-8" alt="Vue logo" src="./assets/logo.svg"/>
      <RegionSelectComponent class="mx-10"/>
    </header>

    <Divider/>

    <div class="flex justify-center w-full h-4/5">
      <div class="w-1/8">
        <SideBar/>
      </div>
      <Panel class="w-5/8">
        <router-view />
      </Panel>
    </div>
  </div>
</template>
