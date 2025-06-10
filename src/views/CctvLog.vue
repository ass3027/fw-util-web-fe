<script setup>
"use strict";
import {onMounted, reactive} from "vue";
import {API} from "@/util/API.js";
import {useRoute} from "vue-router";

const route = useRoute();

onMounted(async () => {
  await cctv.fetch()
  console.log(route.query)
  const queryCctvId = route.query['cctvId'];
  if(queryCctvId === undefined)
    return;

  log.option.logType = LOG_TYPE.FFMPEG;
  log.option.targetCctv = cctv.data.filter(it => it['cctv_ID'] === Number(queryCctvId))[0];

  await log.fetch.run()
})

// noinspection JSUnusedGlobalSymbols
const LOG_TYPE = {
  GSTREAMER: {
    name: "GSTREAMER",
    url: "/gstreamer_log",
    getInferenceId: _ => log.option.inferenceId,
    getFindWord: _ => "Connect failed list"
  },
  FFMPEG: {
    name: "FFMPEG",
    url: "/ffmpeg_log",
    getInferenceId: _ => log.option.targetCctv.inference_id,
    getFindWord: _ => log.option.targetCctv.url
  }
};

const log = reactive({
  data: [],
  option: {
    logType: LOG_TYPE.GSTREAMER,
    targetCctv: undefined,
    inferenceId: "",
    date: new Date(),
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
      const logType = log.option.logType
      return {
        inference_id: logType.getInferenceId(),
        date: formatDate(log.option.date),
        find_word: logType.getFindWord(),
      };
    },
    validateOption(){
      if(log.option.logType.name === LOG_TYPE.GSTREAMER.name)
        if(log.option.inferenceId === "")
          return {status: false, msg: "InferenceId를 선택 해주세요."};

      if(log.option.logType.name === LOG_TYPE.FFMPEG.name)
        if(log.option.targetCctv === undefined)
          return {status: false, msg: "CCTV를 선택 해주세요."};

      if(log.option.date === "")
        return {status: false, msg: "날짜를 선택 해주세요."};

      return  { status: true }
    },
  }
})

const cctv = reactive({
  data: [],
  inferenceIds: [],
  async fetch() {
    const res = await API.post("/cctv_data")
    const data = res.data.message;

    const inferenceIdSet = new Set();
    data.forEach( it => {
      it["L2L3"] = `${it["cctv_address"]["L2"]} ${it["cctv_address"]["L3"]}`
      inferenceIdSet.add(it["inference_id"])
    })
    this.data = data
    this.inferenceIds = Array.from(inferenceIdSet);
  },
})

function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
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
                <label :for="logType.name">{{ logType.name }}</label>
              </div>
            </div>
          </div>
          <div class="flex w-1/7 flex-col gap-2">
            <template v-if="log.option.logType.name === LOG_TYPE.GSTREAMER.name">
              <label for="inferenceId-select" class="font-bold" >InferenceId</label>
              <Select v-model="log.option.inferenceId" :options="cctv.inferenceIds"
                      filter
                      placeholder="Select a inferenceId"
                      inputId="inferenceId-select"
              />
            </template>
            <template v-else>
              <label for="cctv-select" class="font-bold" >CCTV</label>
              <Select v-model="log.option.targetCctv" :options="cctv.data"
                      optionLabel="cctv_name"
                      filter
                      placeholder="Select a CCTV"
                      inputId="cctv-select"
              />
            </template>
          </div>
          <div class="flex flex-col gap-2">
            <label for="log-date-picker" class="font-bold"> 날짜 </label>
            <DatePicker v-model="log.option.date" dateFormat="yy-mm-dd"
                showIcon
                inputId="log-date-picker"
            />
          </div>
          <div class="flex flex-col gap-2">
            <div class="h-2/5"></div>
            <Button @click="log.fetch.run()"
                    raised
                    class="font-bold text-lg"
            >
              검색
            </Button>
          </div>
        </div>
      </template>
    </Card>
    <Card class="flex flex-1 min-h-0"
          pt:body:class="flex flex-1 min-h-0"
          pt:content:class="flex flex-1 min-h-0 p-3 bg-surface-100 border-surface-300 border-2 rounded overflow-auto"
    >
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