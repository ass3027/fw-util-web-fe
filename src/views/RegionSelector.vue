<script setup>
"use strict";
import { API } from "@/util/API.js";
import {onMounted, reactive, ref} from "vue";
import * as loginUtil from "@/util/loginUtil.js"

onMounted(async _ => {
  await regions.fetch();
})

const regions = reactive({
  data: [],
  fetch: async function() {
    const MATRIX_WIDTH = 4;
    const res = await API.get("/db_list");
    this.data = this.format(res.data);
    this.data = this.getMatrix(this.data, MATRIX_WIDTH);
  },
  format: regions => {
    return Object.keys(regions)
        .map(key => {
          return {
            name: key,
            ip: regions[key].ip,
            port: regions[key].port
          }
        })
        .sort(region => region.name.localeCompare(region.name))
  },
  getMatrix: function(array, width) {
    const result = [];
    for(let i = 0; i < array.length; i += width) {
      const chunk = array.slice(i, i + width);
      result.push(chunk);
    }
    return result;
  }

});


const loginModalVisible = ref(false);

const login = reactive({
  region: {},
  username: "",
  password: "",
  loading: false,
  async login() {
    this.loading = true;
    await loginUtil.login(login.region, this.username, this.password)
    this.loading = false;
    loginModalVisible.value = false;
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
                <div v-for="regionRow in regions.data"
                     class="flex flex-1"
                >
                  <div v-for="region in regionRow"
                       class="p-1 flex flex-1">
                    <Button
                        class="flex-1 text-xl font-extrabold text-pretty px-4 py-3"
                        raised
                        @click="loginModalVisible = true; login.region = region"
                    >
                      {{region.name.substring(0,2)}}
                    </Button>
                  </div>
                </div>
              </div>
            </template>

          </Card>
        </div>

      </div>

    </div>

    <Dialog v-model:visible="loginModalVisible"
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