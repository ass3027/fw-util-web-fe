<script setup lang="ts">
"use strict";
const links = [
  {
    label: 'DBDataList',
    icon: 'pi-list',
    route: '/db-data-list'
  },
  {
    label: 'ConnectionFailList',
    icon: 'pi-history',
    route: '/connection-fail-list'
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
      <router-link :to="item.route" v-slot="{ href, navigate }">
        <a class="flex items-center mx-4" v-bind="props.action">
          <span class="pi color-surface-800" :class="item.icon"/>
          <span>{{ item.label }}</span>
        </a>
      </router-link>
    </template>
    <template #end>
<!--      <div class="gap-2 flex-row flex">-->
<!--        <div class="p-2 bg-surface-200 rounded-xl">-->
<!--          <span>경남</span>-->
<!--        </div>-->
<!--        <div class="p-2 bg-surface-200 rounded-xl">-->
<!--          <span>중계 서버: {{"O"}}</span>-->
<!--        </div>-->
<!--        <div class="p-2 bg-surface-200 rounded-xl">-->
<!--          <span>분석 서버: {{3}}</span>-->
<!--        </div>-->
<!--      </div>-->
    </template>
  </Menubar>
</template>

<style scoped>
  :root {
    --p-menubar-background: var(--color-background);
  }
</style>