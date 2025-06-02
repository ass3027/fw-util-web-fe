
const getRegion = _ => JSON.parse(sessionStorage.getItem("region"))
const setRegion = value => sessionStorage.setItem("region", JSON.stringify(value))

export { getRegion, setRegion }