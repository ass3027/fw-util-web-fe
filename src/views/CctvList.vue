<script setup>
"use strict";
import {onMounted, reactive} from "vue";
import {FilterMatchMode} from "@primevue/core/api";
import {API} from "@/util/API.js";
import FFProbeDialog from "@/views/component/FFProbeDialog.vue";
import {useRouter} from "vue-router";

const router =  useRouter();

onMounted(async _ => {
  const isQHD = screen.width === 2560
  cctvTable.rowSize = isQHD ? 15 : 10;
  cctvTable.fetch()
})

const cctvTable = reactive({
  data: [],
  L2Set: [],
  loading: false,
  rowSize: 0,
  filters: {
    L2L3 : { value: null, matchMode: FilterMatchMode.CONTAINS},
    global: { value: null, matchMode: FilterMatchMode.CONTAINS}
  },
  async fetch() {
    this.loading = true;
    const res = await API.post("/cctv_data")
    const data = res.data.message;
    data.forEach( it =>
        it["L2L3"] = `${it["cctv_address"]["L2"]} ${it["cctv_address"]["L3"]}`
    )
    //TODO 지역 filter 작동 잘 안됨. L2 Set 은 정상
    this.L2Set = Array.from(
        new Set(data.map(it => it['cctv_address']['L2']).sort())
    )

    this.data = data
    this.loading = false
  }
});

const ffmpegModal = reactive({
  url: "",
  visible: false,
  inferenceId: "",
})
</script>

<template>
  <Card class="flex-1 min-h-0"
        pt:body:class="flex flex-1 min-h-0"
        pt:content:class="flex flex-1 min-h-0"
  >
    <template #title>
      <span class="font-bold">CCTV List</span>
    </template>
    <template #content>
      <DataTable
          class="border-2 border-surface-300 flex-1 flex flex-col"
          pt:tableContainer:class="flex-1 flex min-h-0"
          pt:bodyRow:class="h-1/10"
          :value="cctvTable.data"
          v-model:filters="cctvTable.filters"
          filter-display="menu"
          :loading="cctvTable.loading"
          :globalFilterFields="['cctv_name']"
          tableStyle="min-width: 50rem"
          selection-mode="single"
          paginator size="small"
          :rows="cctvTable.rowSize" :rows-per-page-options="[10,15,20,30,50]"
          @rowClick="event => router.push(`/cctv-log?cctvId=${event.data['cctv_ID']}`)"
      >
        <template #loading>Loading data...</template>
        <template #header>
          <div class="flex justify-end">
            <IconField class="">
              <InputIcon>
                <i class="pi pi-search text-primary-500"/>
              </InputIcon>
              <InputText class="h-9"
                         v-model="cctvTable.filters['global'].value" placeholder="이름 검색"/>
            </IconField>
          </div>
        </template>
        <Column class="w-1/30 px-3" field="cctv_ID" header="ID" :sortable="true"/>
        <Column class="w-4/30 px-3" header="지역" field="L2L3"
                :showFilterMatchModes="false"
                :filterMenuStyle="{ width: '14rem' }">
          <template #filter="{ filterModel, filterCallback }">
            <MultiSelect v-model="filterModel.value"
                @change="filterCallback()"
                :options="cctvTable.L2Set"
            />
          </template>
        </Column>
        <Column class="w-6/30 px-3" field="cctv_name" header="Name" :sortable="true"/>
        <Column class="w-1/30 px-3" field="inference_id" header="Inference" :sortable="true"/>
        <Column field="url" header="RTSP_URL" :sortable="true"/>
        <Column class="w-2/30 px-3">
          <template #body="{ data }">
            <Button
                class="font-bold"
                severity="error"
                raised
                @click="ffmpegModal.visible = true; ffmpegModal.url = data['url']; ffmpegModal.inferenceId = data['inference_id']"
            >FFProbe</Button>
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
  <FFProbeDialog :visible="ffmpegModal.visible"
                 :url="ffmpegModal.url"
                 :inference-id="ffmpegModal.inferenceId"
                 @close="ffmpegModal.visible = false"/>
</template>

<style scoped>
th, td {
  padding: 2rem;
}
</style>