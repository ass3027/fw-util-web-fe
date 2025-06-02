<script setup>
import {onMounted, reactive} from "vue";
import {API} from "@/util/API.js";

const data = reactive({
  dbDataList: []
})

// onMounted(async _ =>{
//   const res = await API.get("/db-info", {params: {region_id: "gyeongnam"}})
//   data.dbDataList = res.data
// })


</script>

<template>
  <div class="flex items-center justify-center w-full h-full">
    <span class="font-bold text-8xl text-center">developing</span>
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