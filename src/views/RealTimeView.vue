<script setup>
import {onMounted, onUnmounted, useTemplateRef} from 'vue';
import { useRoute } from 'vue-router';
import Hls from 'hls.js';
import { API } from "@/util/API.js";

const route = useRoute();
const inferenceId = route.query.inferenceId || 'svr10';
const cctvId = route.query.cctvId || '10';

const videoPlayerRef = useTemplateRef("videoPlayer");

let hls = null;

onMounted(async () => initHls());

onUnmounted(() => {
  if (hls) {
    hls.destroy();
  }
  API.post("/hls_tunnel_stop");
});

async function fetchHlsSource() {
  try {
    const res = await API.post("/hls_tunnel", {
      inference_id: inferenceId,
      cctv_id: cctvId,
    });
    return res.data.message;
  } catch (error) {
    console.error("Error fetching HLS source:", error);
    throw error;
  }
}

async function initHls() {
  if (!Hls.isSupported())
    throw new Error("Hls is not supported");

  const hlsSourceUrl = await fetchHlsSource();

  hls = new Hls();
  hls.loadSource(hlsSourceUrl);
  hls.attachMedia(videoPlayerRef.value);
  hls.on(Hls.Events.MANIFEST_PARSED, () => videoPlayerRef.value.play());
}
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
      <div class="flex flex-1 min-h-0">
        <video ref="videoPlayer" controls class="flex-1 h-full" autoplay/>
      </div>
    </template>
  </Card>
</template>

<style scoped>
</style> 