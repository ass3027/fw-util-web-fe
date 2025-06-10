<script setup>
"use strict";
import {ref, watch} from "vue";
import {API} from "@/util/API.js";

defineEmits(['close'])
const { visible = false, url = "", inferenceId = "" } = defineProps({
  visible: Boolean,
  url: String,
  inferenceId: String,
})

const modalVisible = ref(false)
watch(()=> visible, () => {
  modalVisible.value = visible;
  if(visible)
    runFFprobe();
})

const loading = ref(false)
const ffmpegResult = ref("")
async function runFFprobe() {
  const body = { url, inference_id: inferenceId };
  loading.value = true
  try {
    const res = await API.post('/run_ffprobe', body, { timeout: 30000})
    ffmpegResult.value = res.data.message
  } catch(e) {
    ffmpegResult.value = e.message.startsWith("timeout")
        ? "연결 시간이 초과되었습니다"
        : e.message;
  }
  loading.value = false
}
</script>
<template>
  <Dialog v-model:visible="modalVisible" modal :closable="false"
          class="w-[40vw] min-h-[30vh] bg-surface-100"
  >
    <template #header>
      <div class="flex flex-1 justify-between items-center">
        <span class="font-bold text-2xl text-surface-800">FFMPEG Result {{ url }}</span>
        <Button class="bg-surface-100 border-none"
                icon="pi pi-times text-surface-800"
                @click="$emit('close')"
        />
      </div>
    </template>
    <div v-if="loading" class="flex  justify-center">
      <ProgressSpinner class="h-[20vh]"/>
    </div>
    <div v-else>
      <span class="whitespace-pre text-surface-800">
        {{ ffmpegResult }}
      </span>
    </div>
  </Dialog>
</template>