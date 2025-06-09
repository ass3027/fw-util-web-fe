"use strict";

import { setRegion, deleteRegion } from "./regionUtil.js";
import {API} from "@/util/API.js";


async function login(region, username, password) {
    const authenticateResult = await isAuthenticated(region, username, password);
    if(!authenticateResult.status){
        alert(authenticateResult.msg);
        return;
    }
    setRegion(region);
    location.href = "/cctv-list";
}

function logout() {
    API.post("/ssh_disconnect")
    deleteRegion()
    location.href = "/login";
}

async function isAuthenticated(region, username, password) {
    console.log(region)
    const loginData = {
        id: username,
        password: password,
        host: region.ip,
        port: region.port,
        region: region.name
    };
    try {
        await API.post("/ssh_connect", loginData)
        return { status: true };
    }catch (e){
        switch(e.status){
            case 400: return await reconnect(loginData);
            case 401: return {status: false, msg: "로그인 인증  실패"};
            case 500: return {status: false, msg: "연결 실패"};
        }
    }
}

async function reconnect(loginData){
    alert("기존 연결을 끊고 다시 연결합니다");
    await API.post("/ssh_disconnect", loginData)
    return isAuthenticated();
}

export { login, logout };