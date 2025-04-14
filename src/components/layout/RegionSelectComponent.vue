<script setup>
import {onMounted, reactive } from "vue";
import { API } from "@/API.js";
import { useRegionStore } from "@/stores/region.js";

const regionStore = useRegionStore();

const region = reactive({
  dict : {}
})


onMounted( async _ => await getRegionDict() )

const getRegionDict = async() => {
  const res = await API.get("/region-dict");
  region.dict = res.data
}
const getRegionKeyMatrix = width => getMatrix(getRegionDictKey(),width)

const getRegionDictKey = _ =>
    Object.keys(region.dict)
        .sort( (a,b) => region.dict[a].name.localeCompare(region.dict[b].name))

const getMatrix = (array, width) => {
  const result = []
  // let tempArray = []
  for (let i = 0; i < array.length; i += width) {
    // const end = Math.max(i+ width, array.length-1)
    const chunk = array.slice(i, i + width);
    result.push(chunk)
  }
  return result
}

// const setRegion = region => region.curRegion = region
</script>

<template>
  <div class="flex w-full h-full justify-center">
    <div class="w-1/5 items-center justify-center border-6 rounded-xl">
      <h3>{{ regionStore.currentRegion }}</h3>
    </div>
    <div class="flex flex-col w-4/5">
      <div v-for="regionKeyRow in getRegionKeyMatrix(5)" class="flex flex-1">
        <div v-for="regionKey in regionKeyRow" class="flex-1">
          <Button
              class="w-full h-full"
              v-on:click="regionStore.setRegion(region.dict[regionKey])"
          >
            {{ region.dict[regionKey].name.substring(0,6) }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>