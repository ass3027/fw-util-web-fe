<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import {API} from "@/API.js";
import {useRegionStore} from "@/stores/region.js";

const regionStore = useRegionStore();

const loading = ref(false)
const data = reactive({
  dbDataList: []
})


onMounted(async _ => await getDBInfo(regionStore.currentRegion))

watch(() => regionStore.currentRegion, getDBInfo)

async function getDBInfo(region) {
  loading.value = true
  const params = { region_id : region['id'] };
  const res = await API.get("/db-info", { params })
  data.dbDataList = res.data
  loading.value = false
}

const probeRtsp = async url => {
  console.log(url)
  // const params = { rtsp_url: url }
  // const res = await API.get("/ffprobe", { params, timeout: 60000 });
  // alert(url + res.data)
  // console.log(res.data)
}

</script>

<template>
  <div>
    <DataTable
        :value="data.dbDataList"
        tableStyle="min-width: 50rem"
        stripedRows
        paginator
        size="small"
        :rows="15"
        :rows-per-page-options="[30,50]"
        :loading="loading"
    >
      <template #loading>Loading data...</template>

      <Column class="w-1/30"  field="cctv_ID" header="ID" :sortable="true"/>
      <Column class="w-3/30"  header="지역">
        <template #body="{ data }">
          {{`${data['cctv_address']['L2']} ${data['cctv_address']['L3']}`}}
        </template>
      </Column>
      <Column class="w-7/30" field="cctv_name" header="Name" :sortable="true"/>
      <Column class="w-1/30" field="inference_id" header="Inference" :sortable="true"/>
      <Column field="url" header="URL" :sortable="true"/>
      <Column class="w-2/30">
        <template #body="{ data }">
          <Button :click="probeRtsp(data['url'])">Probe</Button>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
  .db-info-table th {
    background-color: gray;
  }

  .db-info-table td {
    text-align: center;
  }
</style>