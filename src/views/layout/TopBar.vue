<script setup>
import { getRegion } from "@/util/regionUtil.js";
import * as loginUtil from "@/util/loginUtil.js";
import {onMounted, ref} from "vue";
import {API} from "@/util/API.js";

onMounted(async _ => {
  const region = getRegion();
  const res = await API.post("/page_url", { region: region.name});
  webUrl.value = res.data.message;
})

const webUrl = ref("")

const links = [
  {
    label: 'CCTV List',
    icon: 'pi-list',
    route: '/cctv-list'
  },
  {
    label: 'CCTV Log',
    icon: 'pi-history',
    route: '/cctv-log'
  },
  {
    label: 'RealTimeView',
    icon: 'pi-video',
    route: '/realtime-view'
  }
];


</script>

<template>
  <Menubar :model="links" pt:start:class="h-full">
    <template #start>
      <a class="h-full flex flex-row gap-3 cursor-pointer hover:text-primary-500 rounded-xl"
        :href="webUrl"
      >
        <img class="h-full" src="@/assets/fw-logo.svg" alt="">
        <div class="flex items-center gap-1 p-1">
          <span class="font-semibold text-[1.8rem]">{{ getRegion().name.substring(0,2) }}</span>
          <span class="pi pi-link text-primary-500 text-[1.5rem]"/>
        </div>
      </a>
    </template>
    <template #item="{ item, props }">
      <router-link :to="item.route">
        <a class="flex items-center mx-4 " v-bind="props.action">
          <span class="text-xl pi text-primary-500" :class="item.icon"/>
          <span class="text-xl">{{ item.label }}</span>
        </a>
      </router-link>
    </template>
    <template #end>
      <div class="flex gap-2">
        <div class="flex justify-center items-center p-2 gap-2 cursor-pointer hover:bg-surface-300 rounded-xl"
             @click="loginUtil.logout()"
        >
          <span class="pi pi-sign-out text-primary-500"/>
          <span>로그아웃</span>
        </div>
      </div>
    </template>
  </Menubar>
</template>

<style scoped>
</style>