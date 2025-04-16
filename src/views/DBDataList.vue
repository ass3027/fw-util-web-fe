<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import {API, WS_API_URL} from "@/API.js";
import {useRegionStore} from "@/stores/region.js";

const regionStore = useRegionStore();
let currentSocket = null

const probeRtspDialogVisible = ref(false);
const loading = ref(false)
const data = reactive({
  dbDataList: [],
  ffprobeOutput: ""
})


onMounted(async _ => await getDBInfo(regionStore.currentRegion))

watch(regionStore.currentRegion, getDBInfo)

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
  }catch(err){
    alert(err)
  }

  loading.value = false
}

const probeRtsp = async rtspUrl => {
  console.log(rtspUrl)
  probeRtspDialogVisible.value = true
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
      <Column field="url" header="RTSP_URL" :sortable="true"/>
      <Column class="w-2/30">
        <template #body="{ data }">
          <Button @click="probeRtsp(data['url'])">Probe</Button>
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

<style scoped>
  .db-info-table th {
    background-color: gray;
  }

  .db-info-table td {
    text-align: center;
  }
</style>