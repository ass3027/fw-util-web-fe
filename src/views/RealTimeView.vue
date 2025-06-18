<script setup>
import {onMounted, onUnmounted, reactive, ref, useTemplateRef} from 'vue';
import { useRoute } from 'vue-router';
import Hls from 'hls.js';
import { API } from "@/util/API.js";

const videoPlayerRef = useTemplateRef("videoPlayer");

const route = useRoute();
const cctvId = ref(route.query.cctvId);


let hls = null;

onMounted(async () => {
  await cctv.fetch();
  if(cctvId.value)
    await initHls();
});

onUnmounted(() => {
  if (hls) {
    hls.destroy();
  }
  API.post("/hls_tunnel_stop");
});


async function initHls() {
  if (!Hls.isSupported())
    throw new Error("Hls is not supported");

  const hlsSourceUrl = await fetchHlsSource();

  hls = new Hls();
  hls.loadSource(hlsSourceUrl);
  hls.attachMedia(videoPlayerRef.value);
  hls.on(Hls.Events.MANIFEST_PARSED, () => videoPlayerRef.value.play());
}

async function fetchHlsSource() {
  const targetCctv = cctv.data.filter(it => it['cctv_ID'] === Number(cctvId.value))[0];
  try {
    const res = await API.post("/hls_tunnel", {
      cctv_id: cctvId.value,
      inference_id: targetCctv['inference_id'],
    });
    return res.data.message;
  } catch (error) {
    console.error("Error fetching HLS source:", error);
    throw error;
  }
}

const cctv = reactive({
  data: [],
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
  <Card class="flex-1 min-h-0" 
    pt:content:class="flex flex-1 min-h-0"
    pt:body:class="flex flex-1 min-h-0" 
  >
    <template #title>
      <span class="font-bold text-2xl">RealTimeView</span>
    </template>
    <template #content>
      <div class="flex flex-1 min-h-0 rounded-xl border-5 border-surface-100 bg-surface-100">
        <video ref="videoPlayer" controls class="flex-1 h-full rounded-xl" autoplay/>
      </div>
    </template>
  </Card>
</template>

<style scoped>
</style> 