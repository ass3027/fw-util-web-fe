<script setup>
"use strict";
import {onMounted, reactive} from "vue";
import {FilterMatchMode} from "@primevue/core/api";
import {API} from "@/util/API.js";

onMounted(async _ => cctvTable.fetch())

const cctvTable = reactive({
  data: [],
  L2Set: [],
  loading: false,
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
  },
  async runFfprobe(data) {
    //TODO implement
    console.log(data)
  }
});
</script>

<template>
  <Card>
    <template #title>
      <span class="font-bold">CCTV List</span>
    </template>
    <template #content>
      <DataTable
          class="border-2 border-surface-300"
          :value="cctvTable.data"
          :filters="cctvTable.filters"
          filter-display="menu"
          :loading="cctvTable.loading"
          :globalFilterFields="['cctv_name']"
          tableStyle="min-width: 50rem"
          paginator size="small"
          :rows="10" :rows-per-page-options="[10,30,50]"
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
        <Column class="w-3/30 px-3" header="지역" field="L2L3"
                :showFilterMatchModes="true"
                :filterMenuStyle="{ width: '14rem' }">
          <template #filter="{ filterModel, filterCallback }">
            <MultiSelect v-model="filterModel.value"
                @change="filterCallback()"
                :options="cctvTable.L2Set"
            />
          </template>
        </Column>
        <Column class="w-7/30 px-3" field="cctv_name" header="Name" :sortable="true"/>
        <Column class="w-1/30 px-3" field="inference_id" header="Inference" :sortable="true"/>
        <Column field="url" header="RTSP_URL" :sortable="true"/>
        <Column class="w-2/30 px-3">
          <template #body="{ data }">
            <Button
                class="font-bold"
                severity="error"
                raised
                @click="cctvTable.runFfprobe(data)"
            >FFProbe</Button>
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
</template>

<style scoped>
th, td {
  padding: 2rem;
}
</style>