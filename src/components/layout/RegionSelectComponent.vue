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
  const params = {region: regionStore.currentRegion['id']};
  const res = await API.get("/region-dict", {params});
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
  <div class="row full-width justify-center">
    <div class="cur-region">
      <h3>{{ regionStore.currentRegion }}</h3>
    </div>
    <div class="matrix">
      <div v-for="regionKeyRow in getRegionKeyMatrix(5)" class="region-row row fit">
        <div v-for="regionKey in regionKeyRow" class="region fit">
          <button
              class="region_btn full-width full-height"
              v-on:click="regionStore.setRegion(region.dict[regionKey])"
          >
            {{ region.dict[regionKey].name }}
          </button>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
  .cur-region {
    width: 20%;
    align-items: center;
    justify-items: center;
    border: #f2f2f2 solid 2px;
    border-radius: 10px;
  }
  .matrix {
    width: 80%;
    flex-direction: column;
    display: flex;
  }
</style>