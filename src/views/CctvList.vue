<script setup>
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
    this.L2Set = Array.from(
        new Set(data.map(it => it['cctv_address']['L2']).sort())
    )

    this.data = data
    this.loading = false
  }
});

const ffmpegModal = reactive({
  visible: false,
  url: "",
  inferenceId: "",
})
</script>

<template>
  <Card class="flex-1 min-h-0"
        pt:body:class="flex flex-1 min-h-0"
        pt:content:class="flex flex-1 min-h-0"
  >
    <template #content>
      <DataTable
          class="flex flex-col flex-1 border-2 border-surface-300"
          pt:tableContainer:class="flex flex-1"
          :value="cctvTable.data"
          v-model:filters="cctvTable.filters"
          v-model:rows="cctvTable.rowSize"
          :rows-per-page-options="[10,15,20,30,50]"
          filter-display="menu"
          :loading="cctvTable.loading"
          :globalFilterFields="['cctv_name', 'url']"
          tableStyle="min-width: 50rem"
          selection-mode="single"
          paginator size="small"
          @rowClick="event => router.push(`/cctv-log?cctvId=${event.data['cctv_ID']}`)"
      >
        <template #loading>Loading data...</template>
        <template #header>
          <div class="flex justify-between items-center">
            <span class="font-bold text-2xl ml-2">CCTV List</span>
            <IconField>
              <InputIcon>
                <i class="pi pi-search text-primary-500"/>
              </InputIcon>
              <InputText class="h-9"
                         v-model="cctvTable.filters['global'].value" placeholder="이름 검색"/>
            </IconField>
          </div>
        </template>
        <Column class="w-3/60 text-center" field="cctv_ID" header="ID" :sortable="true" :pt="{ columnHeaderContent: { class: 'justify-center'}}"/>
        <Column class="w-4/30" header="지역" field="L2L3"
                :showFilterMatchModes="false"
                :filterMenuStyle="{ width: '14rem' }">
          <template #filter="{ filterModel, filterCallback }">
            <MultiSelect v-model="filterModel.value"
                @change="filterCallback()"
                :options="cctvTable.L2Set"
            />
          </template>
        </Column>
        <Column class="w-6/30" field="cctv_name" header="Name" :sortable="true"/>
        <Column class="w-5/60" field="inference_id" header="Inference" :sortable="true"/>
        <Column class="flex-1" field="url" header="RTSP_URL" :sortable="true"/>
        <Column class="w-3/60 text-center" header="RealTime" :pt="{ columnHeaderContent: { class: 'justify-center'}}">
          <template #body="{ data }">
            <div class="rounded-lg hover:bg-surface-500 hover:text-surface-800 cursor-pointer"
                 @click="router.push(`/realtime-view?cctvId=${data['cctv_ID']}&inferenceId=${data['inference_id']}`)">
              <span class="pi pi-video text-primary-500 text-3xl m-2"/>
            </div>
          </template>
        </Column>
        <Column class="w-2/30 text-center" header="FFProbe" :pt="{ columnHeaderContent: { class: 'justify-center'}}">
          <template #body="{ data }">
            <div class="rounded-lg hover:bg-surface-500 hover:text-surface-800 cursor-pointer"
                 @click="ffmpegModal.visible = true; ffmpegModal.url = data['url']; ffmpegModal.inferenceId = data['inference_id']">
              <span class="pi pi-check-circle text-green-400 text-3xl m-2"/>
            </div>
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
</style>