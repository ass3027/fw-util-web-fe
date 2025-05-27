<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import {API, WS_API_URL} from "@/API.js";
import { useRegionStore } from "@/stores/region.js";
import { FilterMatchMode } from '@primevue/core/api';

const regionStore = useRegionStore();
let currentSocket = null

const probeRtspDialogVisible = ref(false);
const loading = ref(false)
const filters = ref({
  L2L3 : { value: null, matchMode: FilterMatchMode.CONTAINS},
  global: { value: null, matchMode: FilterMatchMode.CONTAINS}
})
const data = reactive({
  dbDataList: [],
  ffprobeOutput: ""
})


onMounted(async _ => await getDBInfo(regionStore.currentRegion))

regionStore.$subscribe((_, state) => {
  getDBInfo(state.currentRegion)
})

watch(probeRtspDialogVisible, value => {
 if(!value)
   closeSocket()
})

async function getDBInfo(region) {
  loading.value = true
  const params = { region_id : region['id'] };
  try{
    const res = await API.get("/db-info", { params })
    data.dbDataList = res.data
    data.dbDataList.map(it => it["L2L3"] = `${it["cctv_address"]["L2"]} ${it["cctv_address"]["L3"]}`)
  }catch(err){
    alert(err)
  }

  loading.value = false
}

const probeRtsp = async rtspUrl => {
  probeRtspDialogVisible.value = true
  openSocket(rtspUrl)
}

const openSocket = rtspUrl => {
  const regionId = regionStore.currentRegion.id;
  const endpoint = `${WS_API_URL}/ws/ffprobe/${regionId}`;
  const ws = new WebSocket(endpoint);
  currentSocket = ws

  ws.onopen = _ => {
    console.log("Connected")
    ws.send(rtspUrl)
  }
  ws.onmessage = event => {
    data.ffprobeOutput = event.data
    console.log(data.ffprobeOutput)
  }
  ws.onclose = _ => console.log("Connection closed")
}

const closeSocket = () => {
  probeRtspDialogVisible.value = false
  data.ffprobeOutput = "";
  console.log("try to close socket")
  if (currentSocket) {
    console.log("closing socket...");
    currentSocket.close();
    currentSocket = null;
  }
}

</script>

<template>
  <div>
    <DataTable
        :value="data.dbDataList"
        v-model:filters="filters"
        filter-display="menu"
        :globalFilterFields="['cctv_name']"
        tableStyle="min-width: 50rem"
        stripedRows paginator size="small"
        :rows="10" :rows-per-page-options="[10,30,50]"
        :loading="loading"
    >
      <template #loading>Loading data...</template>
      <template #header>
        <div class="flex justify-end">
          <IconField>
            <InputIcon>
              <i class="pi pi-search"/>
            </InputIcon>
            <InputText v-model="filters['global'].value" placeholder="이름 검색"/>
          </IconField>
        </div>
      </template>
      <Column class="w-1/30" field="cctv_ID" header="ID" :sortable="true"/>
      <Column class="w-3/30" header="지역"
              field="L2L3"
              :showFilterMatchModes="true"
              :filterMenuStyle="{ width: '14rem' }">
        <template #filter="{ filterModel, filterCallback }">
          <MultiSelect
              v-model="filterModel.value"
              @change="filterCallback()"
              :options="Array.from(
                  new Set(
                      data.dbDataList.map(it => it['cctv_address']['L2']).sort()
                  ))"
          />
        </template>
      </Column>
      <Column class="w-7/30" field="cctv_name" header="Name" :sortable="true"/>
      <Column class="w-1/30" field="inference_id" header="Inference" :sortable="true"/>
      <Column field="url" header="RTSP_URL" :sortable="true"/>
      <Column class="w-2/30">
        <template #body="{ data }">
          <Button
              class="font-medium"
              @click="probeRtsp(data['url'])"
              label="Probe"
              severity="info"
              raised
          />
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="probeRtspDialogVisible"
            class="w-2/5"
            modal header="RTSP PROBE RESULT"
    >
      <span class="whitespace-pre-wrap"> {{data.ffprobeOutput}} </span>
    </Dialog>
  </div>
</template>