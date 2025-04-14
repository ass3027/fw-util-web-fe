<script setup>
import {onMounted, reactive} from "vue";
import {API} from "@/API.js";

const data = reactive({
  dbDataList: []
})

onMounted(async _ =>{
  const res = await API.get("/db-info", {params: {_region: "gyeongnam"}})
  data.dbDataList = res.data
})

const probeRtsp = url => console.log(url)

</script>

<template>
  <div class="flex">
    <table class="db-info-table fit">
      <colgroup>
        <col style="width: 5%"/>
        <col style="width: 15%"/>
        <col style="width: 15%"/>
        <col style="width: 7%"/>
        <col style="width: 40%"/>
        <col style="width: 7%"/>
      </colgroup>
      <thead>
        <tr>
          <th>ID</th>
          <th>지역</th>
          <th>name</th>
          <th>inference</th>
          <th>URL</th>
          <th>검증</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for = "dbData in data.dbDataList">
          <td>{{dbData['cctv_ID']}}</td>
          <td>{{`${dbData['cctv_address']['L2']} ${dbData['cctv_address']['L3']}`}}</td>
          <td>{{dbData['cctv_name']}}</td>
          <td>{{dbData['inference_id']}}</td>
          <td>{{dbData['url']}}</td>
          <td class="flex">
            <button
                class="fit"
                v-on:click="probeRtsp(dbData['url'])"
            >
              Probe
            </button>
          </td>
        </tr>
      </tbody>
    </table>
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