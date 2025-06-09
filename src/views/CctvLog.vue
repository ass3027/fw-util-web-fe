<script setup>

import {onMounted, reactive} from "vue";
import {API} from "@/util/API.js";

onMounted(async () => {
  cctv.fetch()
  log.data = (await API.post("/ffmpeg_log",{
    date: "2025-06-05",
    find_word: "rtsp://admin:admin@192.168.12.252/22/stream1",
    inference_id: "svr10"
  })).data.message
})

const log = reactive({
  data: [],
  fetch: {
    targetCctv: undefined,
    param: {
      inference_id: "svr10",
      date: "2025-06-05",
      find_word: "rtsp://admin:admin@192.168.12.252/1/stream1",
    },
    async ffmpeg() {
      const validateParam = this.validateParam();
      if(!validateParam.status){
        alert(validateParam.msg)
        return
      }
      const res = await API.post("/ffmpeg_log",this.getParam())
      log.data = res.data.message;
    },
    validateParam(){
      if(this.targetCctv === undefined)
        return {status: false, msg: "CCTV를 선택 해주세요."}
      if(this.param.date === "")
        return {status: false, msg: "날짜를 선택 해주세요."}
      return  { status: true }
    },
    getParam(){
      this.param.inference_id = this.targetCctv.inference_id;
      this.param.find_word = this.targetCctv.url;
      return this.param;
    }
  }
})

const cctv = reactive({
  data: [],
  async fetch() {
    const res = await API.post("/cctv_data")
    const data = res.data.message;
    data.forEach( it =>
        it["L2L3"] = `${it["cctv_address"]["L2"]} ${it["cctv_address"]["L3"]}`
    )
    this.data = data
  },
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <span class="text-surface-800 text-xl font-bold">CCTV Log</span>
    <Card pt:body:class="p-4">
      <template #content>
        <div class="flex justify-items-start gap-6">
          <div class="flex flex-col gap-2">
            <label for="cctv-select" class="font-bold" >CCTV</label>
            <Select v-model="log.fetch.targetCctv" :options="cctv.data"
                optionLabel="cctv_name"
                filter
                placeholder="Select a CCTV"
                inputId="cctv-select"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="log-date-picker" class="font-bold"> 날짜 </label>
            <DatePicker v-model="log.fetch.param.date" dateFormat="yy-mm-dd"
                showIcon
                inputId="log-date-picker"
            />
          </div>
          <Button @click="log.fetch.ffmpeg()" raised>조회</Button>
        </div>
      </template>
    </Card>
    <Card class="flex-1 min-h-0 overflow-auto">
      <template #content>
        <span class="whitespace-pre">{{ log.data.join("\n") }}</span>
      </template>
    </Card>
  </div>
</template>

<style scoped>

</style>