import {defineStore} from "pinia";
import { ref } from "vue";

//TODO localStorage 써서 새로고침시에도 유지되게 하자 getter 사용
export const useRegionStore = defineStore('region', () => {
    const currentRegion = ref({
        id: "gyeongnam",
        name: "경남",
        user: "",
        pw: "",
        ip: "",
        port: 0
    })
    const setRegion = value => currentRegion.value = value
    return { currentRegion, setRegion }
})