"use strict";

const getRegion = _ => {
    const regionJson = sessionStorage.getItem("region");
    if (regionJson === null){
        location.href = "/login";
        return;
    }

    return JSON.parse(regionJson);
}

const setRegion = value => sessionStorage.setItem("region", JSON.stringify(value))

const deleteRegion = _ => sessionStorage.removeItem("region");

export { getRegion, setRegion, deleteRegion }