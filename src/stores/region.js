import {defineStore} from "pinia";
import { ref } from "vue";

export const useRegionStore = defineStore('region', () => {
    const currentRegion = ref({
        id: "gangwon",
        name: "",
        user: "",
        pw: "",
        ip: "",
        port: 0
    })
    const setRegion = value => currentRegion.value = value
    return { currentRegion, setRegion }
})