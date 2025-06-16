<script setup>
"use strict";
import { API } from "@/util/API.js";
import { onMounted, reactive, ref } from "vue";
import * as loginUtil from "@/util/loginUtil.js";

const MATRIX_WIDTH = 4;

onMounted(async _ => {
  await regions.fetch();
  for (const region of regions.data) {
    regions.checkConnection(region);
  }
})

const regions = reactive({
  data: [],
  fetch: async function() {
    const res = await API.get("/db_list");
    this.data = this.format(res.data);
  },
  format: regionData => {
    return Object.keys(regionData)
      .map(key => ({
        name: key,
        ip: regionData[key].ip,
        port: regionData[key].port,
        connectionStatus: undefined
      }))
      .sort(region => region.name.localeCompare(region.name));
  },
  getIndexMatrix: function(array, width) {
    const result = [];
    for (let i = 0; i < array.length; i += width) {
      const row = [];
      for (let j = i; j < i + width && j < array.length; j++) {
        row.push(j);
      }
      result.push(row);
    }
    return result;
  },
  async checkConnection(region) {
    try {
      const res = await API.get('/ssh_status_check', { params: { ip: region.ip, port: region.port } });
      region.connectionStatus = res.data.status;
    } catch (e) {
      region.connectionStatus = false;
    }
  }
});

const login = reactive({
  region: {},
  username: "",
  password: "",
  loading: false,
  modalVisible: false,
  async login() {
    this.loading = true;
    await loginUtil.login(login.region, this.username, this.password)
    this.loading = false;
    this.modalVisible = false;
  }
})
</script>

<template>
  <div class="flex h-full items-center justify-center">
    <div class="flex w-[1300px] h-[760px] bg-surface-200 rounded-2xl justify-end">
      <img class="absolute -translate-x-80 translate-y-30 w-1/2 h-1/2 z-0"
           src="@/assets/login-logo.png" alt="">

      <div class="flex flex-col w-[42%] justify-center items-center
                bg-[#ffffff0d] backdrop-blur-xl rounded-r-2xl  border-1 border-surface-400"
      >
        <img class="w-1/3" src="@/assets/dara-logo.svg" alt=""/>
        <span class="m-4 text-lg">Maintenance for</span>
        <img class="w-1/3 pb-4" src="@/assets/firewatcher-logo.svg" alt="" />
        <div class="flex p-4">
          <Card class="w-full backdrop-blur-lg z-1"
                pt:body:class="h-full"
                pt:content:class="h-full"
          >
            <template #content>
              <div class="flex flex-col justify-between h-full">
                <div v-for="row in regions.getIndexMatrix(regions.data, MATRIX_WIDTH)" class="flex flex-1">
                  <div v-for="regionIdx in row" :key="regionIdx" class="p-1 flex flex-1 items-center">
                    <span
                      class="inline-block w-3 h-3 rounded-full mr-2"
                      :class="regions.data[regionIdx]?.connectionStatus === undefined ? 'bg-gray-400' : (regions.data[regionIdx]?.connectionStatus ? 'bg-green-500' : 'bg-red-500')"
                      :title="regions.data[regionIdx]?.connectionStatus === undefined ? 'Checking...' : (regions.data[regionIdx]?.connectionStatus ? 'Connected' : 'Disconnected')"
                    ></span>
                    <Button
                        class="flex-1 text-xl font-extrabold text-pretty px-4 py-3"
                        raised
                        @click="login.modalVisible = true; login.region = regions.data[regionIdx]"
                    >
                      {{regions.data[regionIdx]?.name.substring(0,2)}}
                    </Button>
                  </div>
                </div>
              </div>
            </template>

          </Card>
        </div>

      </div>

    </div>

    <Dialog v-model:visible="login.modalVisible"
            class="w-[400px] h-[350px] flex"
            :dismissableMask="true"
            pt:root:class="!border-0 !bg-transparent" pt:mask:class="backdrop-blur-sm">
      <template #container="{ closeCallback }">
        <!--suppress CssUnresolvedCustomProperty -->
        <div class="flex flex-1 justify-center items-center px-8 py-8 rounded-2xl"
            @keyup.enter="login.login()"
            style="background-image: radial-gradient(circle at left top, var(--p-surface-50), var(--p-surface-300))">
          <div v-if="!login.loading" class="flex flex-col gap-6">
            <div class="inline-flex flex-col gap-2">
              <label for="username" class="text-primary-300 font-extrabold">Username</label>
              <InputText id="username" v-model="login.username" class="!bg-white/20 !border-0 !p-4 !text-primary-300 w-80"></InputText>
            </div>
            <div class="inline-flex flex-col gap-2">
              <label for="password" class="text-primary-300 font-bold">Password</label>
              <InputText id="password" v-model="login.password" class="!bg-white/20 !border-0 !p-4 !text-primary-300 w-80" type="password"></InputText>
            </div>
            <div class="flex items-center gap-4">
              <Button @click="login.login()" text class="!p-4 w-full font-bold !text-primary-300 !border !border-white/30 hover:!bg-white/10">Login</Button>
              <Button @click="closeCallback" text class="!p-4 w-full font-bold !text-primary-300 !border !border-white/30 hover:!bg-white/10">Cancel</Button>
            </div>
          </div>
          <ProgressSpinner v-else class="w-[150px] h-[150px]"/>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<style scoped>

</style>