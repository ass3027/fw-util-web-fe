<script setup>
"use strict";
import { getRegion } from "@/util/regionUtil.js";
import * as loginUtil from "@/util/loginUtil.js";
import {onMounted, ref} from "vue";
import {API} from "@/util/API.js";

onMounted(async _ => {
  const region = getRegion()
  const res = await API.post("/page_url", { region: region.name})
  webUrl.value = res.data.message
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
  <Menubar :model="links">
    <template #start>
      <img class="mr-8" src="@/assets/fw-logo.svg" alt="">
    </template>
    <template #item="{ item, props }">
      <router-link :to="item.route">
        <a class="flex items-center mx-4" v-bind="props.action">
          <span class="pi text-primary-500" :class="item.icon"/>
          <span>{{ item.label }}</span>
        </a>
      </router-link>
    </template>
    <template #end>
      <div class="flex gap-2">
        <div class="px-4 py-2 bg-surface-200 rounded-xl">
          <a class="text-xl font" :href="webUrl">{{ getRegion().name }}</a>
        </div>
        <a class="flex justify-center items-center p-2 gap-2 cursor-pointer hover:bg-surface-300 rounded-xl"
           :href="webUrl"
        >
          <span class="pi pi-link text-primary-500"/>
          <span>웹 이동</span>
        </a>
        <div class="flex justify-center items-center p-2 gap-2 cursor-pointer hover:bg-surface-300 rounded-xl"
             @click="loginUtil.logout()"
        >
          <span class="pi pi-replay text-primary-500"/>
          <span>지역선택</span>
        </div>
      </div>
    </template>
  </Menubar>
</template>

<style scoped>
  :root {
    --p-menubar-background: var(--color-background);
  }
</style>