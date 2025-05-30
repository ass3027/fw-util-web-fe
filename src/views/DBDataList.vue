<script setup>
"use strict";
import {onMounted, reactive} from "vue";
import {FilterMatchMode} from "@primevue/core/api";
import {API} from "@/API.js";

onMounted(async _ => table.getCctvData())

const table = reactive({
  data: [],
  loading: false,
  filters: {
    L2L3 : { value: null, matchMode: FilterMatchMode.CONTAINS},
    global: { value: null, matchMode: FilterMatchMode.CONTAINS}
  },
  async getCctvData() {
    this.loading = true;
    const res = await API.get("/cctv-list")
    res.data
    setTimeout(() => {
      this.data = tempData;
      this.loading = false
    }, 2000)
  }
});

const tempData = [
  {}
]

</script>

<template>
<!--  <Card class="w-full h-full">-->
  <Card class="">
    <template #title>
      <span class="font-bold">CCTV List</span>
    </template>
    <template #content>
      <DataTable
          class="border-2 border-surface-300"
          :value="table.data"
          :filters="table.filters"
          filter-display="menu"
          :loading="table.loading"
          :globalFilterFields="['cctv_name']"
          tableStyle="min-width: 50rem"
          stripedRows
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
                         v-model="table.filters['global'].value" placeholder="이름 검색"/>
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
                :options="Array.from(
                  new Set(
                      table.data.map(it => it['cctv_address']['L2']).sort()
                  ))"
            />
          </template>
        </Column>
        <Column class="w-7/30 px-3" field="cctv_name" header="Name" :sortable="true"/>
        <Column class="w-1/30 px-3" field="inference_id" header="Inference" :sortable="true"/>
        <Column field="url" header="RTSP_URL" :sortable="true"/>
        <Column class="w-2/30 px-3">
          <template #body="{ data }">
            <Button
                class="font-medium"
                label="Probe"
                severity="error"
                raised
            />
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