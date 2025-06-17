<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import Hls from 'hls.js';

const videoPlayer = ref(null);
const hls = ref(null);
const hlsSource = ref('https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'); // Example HLS stream

onMounted(() => {
  if (Hls.isSupported()) {
    hls.value = new Hls();
    hls.value.loadSource(hlsSource.value);
    hls.value.attachMedia(videoPlayer.value);
    hls.value.on(Hls.Events.MANIFEST_PARSED, () => {
      videoPlayer.value.play();
    });
  } else if (videoPlayer.value.canPlayType('application/vnd.apple.mpegurl')) {
    videoPlayer.value.src = hlsSource.value;
    videoPlayer.value.addEventListener('loadedmetadata', () => {
      videoPlayer.value.play();
    });
  }
});

onUnmounted(() => {
  if (hls.value) {
    hls.value.destroy();
  }
});
</script>
<template>
  <Card class="flex-1 min-h-0" 
    pt:content:class="flex flex-1 min-h-0"
    pt:body:class="flex flex-1 min-h-0" 
  >
    <template #content>
      <div class="flex flex-1 min-h-0 justify-center items-center bg-black">
        <video ref="videoPlayer" controls class="flex-1 h-full object-fill" autoplay/>
      </div>
    </template>
  </Card>
</template>

<style scoped>
</style> 