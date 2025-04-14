<script setup>
import RegionSelectComponent from "@/components/layout/RegionSelectComponent.vue";
import SideBar from "@/components/layout/SideBar.vue";
import RealTimeView from "@/views/RealTimeView.vue";
import { ref } from 'vue';

const showRealTimeView = ref(false);
</script>

<template>
  <div class="column items-center full-width">
    <div class="column justify-center" style="width: 80%; height: 100%;">
      <header class="row justify-center" style="height: 20%;">
        <div class="row" style="width: 80%;">
          <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125px" height="125px"/>
          <RegionSelectComponent/>
          <nav>
            <router-link to="/db-data-list">DBDataList</router-link> |
            <router-link to="/connection-fail-list">ConnectionFailList</router-link> |
            <router-link to="" @click="showRealTimeView = true">Open RealTime View</router-link>
          </nav>
        </div>
      </header>

      <div class="row justify-center" style="height: 80%">
        <div style="width: 15%">
          <SideBar/>
        </div>
        <main class="row justify-center" style="width: 85%">
          <div style="width: 85%;">
            <router-view></router-view>
          </div>
        </main>
      </div>
    </div>
    <RealTimeView v-if="showRealTimeView"  :show="showRealTimeView" @close="showRealTimeView = false" />
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
  height: 25%;
  padding: 0;
  margin-bottom: 50px;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    /*place-items: center;*/
    /* padding-right: calc(var(--section-gap) / 2); */
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
<style>
  .fit {
    flex: 1;
  }
  .flex {
    display: flex;
  }
  .items-center {
    align-items: center;
  }
  .justify-center {
    justify-content: center;
  }

  .row {
    display: flex;
    flex-direction: row;
  }
  .column {
    display: flex;
    flex-direction: column;
  }

  .full-height {
    height: 100%;
  }
  .full-width {
    width: 100%;
  }
</style>
