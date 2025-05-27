<script setup lang="ts">
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
]
</script>

<template>
<!--  <div class="flex justify-between p-4">-->
<!--    <div>-->
<!--      <img src="@/assets/fw-logo.svg" alt="">-->

<!--    </div>-->
<!--    <div>-->
<!--    </div>-->
<!--  </div>-->
  <Menubar :model="links">
    <template #start>
      <img src="@/assets/fw-logo.svg" alt="">
    </template>
    <template #item="{ item, props, root}">
      <router-link :to="item.route" v-slot="{ href, navigate }">
        <a class="flex items-center" v-bind="props.action">
          <span class="pi color-surface-800" :class="item.icon"/>
          <span>{{ item.label}}</span>
        </a>
      </router-link>
    </template>
    <template #end>

    </template>
  </Menubar>
</template>

<style scoped>
  :root {
    --p-menubar-background: var(--color-background);
  }
</style>