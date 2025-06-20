<script setup>
import {onMounted, onUnmounted, reactive, useTemplateRef} from 'vue';
import { useRoute } from 'vue-router';
import Hls from 'hls.js';
import { API } from "@/util/API.js";

const videoPlayerRef = useTemplateRef("videoPlayer");
const route = useRoute();
let hls = null;

onMounted(async () => {
  await cctv.fetch();
  const queryCctvId = route.query.cctvId;
  if(queryCctvId !== "")
    cctv.target = cctv.data.filter(it => it['cctv_ID'] === Number(queryCctvId))[0];

  if(cctv.target !== undefined)
    await loadHls();
});

onUnmounted(() => {
  disconnect();
});

function disconnect() {
  if (hls){
    hls.destroy();
    hls = null;
  }

  API.post("/hls_tunnel_stop");
}



async function loadHls() {
  if(hls != null)
    disconnect();

  if (!Hls.isSupported())
    throw new Error("Hls is not supported");

  const hlsSourceUrl = await fetchHlsSource();

  hls = new Hls();
  hls.loadSource(hlsSourceUrl);
  hls.attachMedia(videoPlayerRef.value);
  hls.on(Hls.Events.MANIFEST_PARSED, () => videoPlayerRef.value.play());
}

async function fetchHlsSource() {
  try {
    const res = await API.post("/hls_tunnel", {
      cctv_id: cctv.target['cctv_ID'],
      inference_id: cctv.target['inference_id'],
    });
    return res.data.message;
  } catch (error) {
    console.error("Error fetching HLS source:", error);
    throw error;
  }
}

const cctv = reactive({
  data: [],
  target: undefined,
  async fetch() {
    const res = await API.post("/cctv_data")
    const data = res.data.message;
    data.forEach( it => {
      it["L2L3"] = `${it["cctv_address"]["L2"]} ${it["cctv_address"]["L3"]}`
    });
    this.data = data;
  },
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <span class="font-bold text-xl">RealTimeView</span>
    <div class="flex gap-4">
      <Card class="flex w-1/4" pt:body:class="p-4">
        <template #content>
          <div class="flex justify-items-start gap-6">
            <div class="flex flex-col flex-1 justify-items-start gap-2">
              <label for="cctv-select" class="font-bold" >CCTV</label>
              <Select v-model="cctv.target" :options="cctv.data"
                      class="text-base"
                      filter
                      option-label="cctv_name"
                      placeholder="Select a CCTV"
                      input-id="cctv-select"
              />
            </div>
            <div class="flex flex-col gap-2">
              <div class="h-2/5"></div>
              <Button @click="loadHls();"
                      raised
                      class="font-bold text-lg"
              >
                연결
              </Button>
            </div>
          </div>
        </template>
      </Card>
      <Card class="flex flex-1 justify-center" pt:body:class="p-4">
        <template #content>
          <div class="flex gap-10 px-2">
            <div class="flex flex-col gap-2">
              <span class="font-semibold">분석 서버</span>
              <span class="h-[1.875rem] text-2xl font-semibold">
                {{ cctv.target !== undefined ? cctv.target['inference_id'] : "- -" }}
              </span>
            </div>
            <div class="flex flex-col gap-2">
              <span class="font-semibold">RTSP URL</span>
              <span class="h-[1.875rem] text-2xl font-semibold">
                {{ cctv.target !== undefined ? cctv.target['url'] : "- -" }}
              </span>
            </div>
          </div>
        </template>
      </Card>
    </div>
    <Card class="flex-1 min-h-0"
          pt:content:class="flex flex-1 min-h-0"
          pt:body:class="flex flex-1 min-h-0"
    >
      <template #content>
        <div class="flex flex-1 min-h-0 rounded-xl border-5 border-surface-100 bg-surface-100">
          <video ref="videoPlayer" class="flex-1 h-full rounded-xl"
                 autoplay controls muted/>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
</style> 