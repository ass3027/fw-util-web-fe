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

const LOG_TYPE = {
  GSTREAMER: {
    name: "GSTREAMER",
    url: "/gstreamer_log",
    getFindWord: _ => "Connect failed list"
  },
  FFMPEG: {
    name: "FFMPEG",
    url: "/ffmpeg_log",
    getFindWord: _ => log.option.targetCctv.url
  }
};

const log = reactive({
  data: [],
  option: {
    logType: LOG_TYPE.GSTREAMER,
    targetCctv: undefined,
    date: getNow(),
  },
  fetch: {
    async run() {
      const validateOption = this.validateOption();
      if(!validateOption.status){
        alert(validateOption.msg);
        return;
      }
      const res = await API.post(log.option.logType.url, this.getParam());
      log.data = res.data.message;
    },
    getParam(){
      return {
        inference_id: log.option.targetCctv.inference_id,
        date: log.option.date,
        find_word: log.option.logType.getFindWord(),
      };
    },
    validateOption(){
      if(log.option.targetCctv === undefined)
        return {status: false, msg: "CCTV를 선택 해주세요."}
      if(log.option.date === "")
        return {status: false, msg: "날짜를 선택 해주세요."}
      return  { status: true }
    },
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

function getNow() {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <span class="text-surface-800 text-xl font-bold">CCTV Log</span>
    <Card pt:body:class="p-4">
      <template #content>
        <div class="flex justify-items-start gap-6">
          <div class="flex flex-col gap-2">
            <label for="cctv-select" class="font-bold" >Log 타입</label>
            <div class="flex-1 flex gap-3 justify-center items-center">
              <div v-for="logType in LOG_TYPE" :key="logType"
                   class="flex items-center gap-2">
                <RadioButton v-model="log.option.logType"
                             :inputId="logType.name" :value="logType"/>
                <label :for="logType">{{ logType.name }}</label>
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <label for="cctv-select" class="font-bold" >CCTV</label>
            <Select v-model="log.option.targetCctv" :options="cctv.data"
                optionLabel="cctv_name"
                filter
                placeholder="Select a CCTV"
                inputId="cctv-select"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="log-date-picker" class="font-bold"> 날짜 </label>
            <DatePicker v-model="log.option.date" dateFormat="yy-mm-dd"
                showIcon
                inputId="log-date-picker"
            />
          </div>
          <Button @click="log.fetch.run()" raised>조회</Button>
        </div>
      </template>
    </Card>
    <Card class="flex-1 min-h-0 overflow-auto">
      <template #content>
        <span v-if="log.data.length !== 0" class="whitespace-pre">
          {{ log.data.join("\n") }}
        </span>
        <span v-else class="font-bold text-3xl">검색된 로그 없음</span>
      </template>
    </Card>
  </div>
</template>

<style scoped>

</style>