"use strict";

const getRegion = _ => {
    const regionJson = sessionStorage.getItem("region");
    if (regionJson === null)
        location.href = "/region-selector";

    return JSON.parse(regionJson)
}
const setRegion = value => sessionStorage.setItem("region", JSON.stringify(value))

export { getRegion, setRegion }