<script setup>
// import { io } from '@/assets/socketIo.io-client'
import {io} from 'socket.io-client'
import {onMounted, onUnmounted, reactive, watch} from 'vue';

const props = defineProps({
    show: {
        type: Boolean,
        required: true
    }
});

watch(() => props.show, newValue => newValue && setSocket('svr10'))

const emit = defineEmits(['close']);

const svrNameList = ['svr10', 'svr11', 'svr20', 'svr21'];

let imageTag = null
let unitImageWidth = 0
let unitImageheight = 0

onMounted(() => {
    setSocket('svr10')
    // Add event listener for window close
    window.addEventListener('beforeunload', handleBeforeUnload)
})

onUnmounted(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload)
    disconnectSocket();
})

const closePopup = () => {
    disconnectSocket();
    emit('close');
}

const handleBeforeUnload = () => {
    disconnectSocket();
    data.imageUrl = ""
    data.imageHeight = 0
}

const disconnectSocket = () => {
    if (currentSocket) {
        console.log("Disconnecting socket...");
        currentSocket.disconnect();
        currentSocket = null;
    }
}

const data = reactive({
    imageUrl: "",
    imageHeight: 0
})

let currentSocket = null;

const setSocket = svrName => {
    disconnectSocket();
    
    const gpuNum = svrName.charAt(3)
    const port = gpuNum === '1' ? 10115 : 10116
    const endpoint = `http://localhost:${port}/streamsock`
    const socket = io(endpoint);

    currentSocket = socket;

    socket.on('connect_error', err => console.error('Connection error:', err));

    socket.on('disconnect', reason => console.log('Disconnected:', reason));

    socket.on('connect', () => {
        socket.emit('connfront', svrName);
        console.log('Connected to the socket server');
    });

    socket.on('connfront_res', streamid => {
        console.log('connfront_res : ' + streamid);
        socket.emit('reqstream', streamid);
    })

    socket.on('stream', displayImage);
}

const displayImage = base64Data => {
    const imageByte = atob(base64Data);
    const byteArray = new Uint8Array(imageByte.length);

    byteArray.set(Array.from(imageByte, char => char.charCodeAt(0)))
    const blob = new Blob([byteArray], {type: 'image/jpeg'});
    data.imageUrl = URL.createObjectURL(blob);
}

const handleImageLoad = (event) => {
    data.imageHeight = event.target.naturalHeight;
    URL.revokeObjectURL(data.imageUrl);
    imageTag = document.querySelector("#streamedImage")
    unitImageWidth = imageTag.clientWidth / 8
    unitImageheight = 154.28 // 1080 / 7
}

const zoomImage = e => {
    console.log([e.offsetX, e.offsetY])
    const indexX = Math.floor(e.offsetX / unitImageWidth)
    const indexY = Math.floor(e.offsetY / unitImageheight)
    const indexVideo = indexX + indexY * 8
    console.log(indexVideo)    // console.log([evn])
    currentSocket.emit('reqstream', indexVideo)
}
</script>
<template>
    <Teleport to="body">
        <div v-if="show" class="modal-overlay" @click="closePopup">
            <div class="modal-content" @click.stop>
                <div class="header">
                    <div class="server-btn-div">
                        <button 
                            v-for="svrName in svrNameList"
                            @click="setSocket(svrName)"
                        >
                            {{ svrName }}
                        </button>
                    </div>
                    <button class="close-btn" @click="closePopup">×</button>
                </div>
                <div class="image-container">
                    <img 
                        id="streamedImage"
                        alt=""
                        :src="data.imageUrl" 
                        @click="zoomImage"
                        @load="handleImageLoad"
                        :style="{ height: data.imageHeight + 'px' }"
                    />
                </div>
            </div>
        </div>
    </Teleport>
</template>
<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    width: 95vw;
    height: 95vh;
    background-color: #f5f5f5;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    /* overflow: hidden; */
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 7px;
    background-color: #fff;
    border-bottom: 1px solid #ddd;
}

.server-btn-div {
    display: flex;
    gap: 10px;
}

.server-btn-div button {
    padding: 8px 16px;
    cursor: pointer;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #f8f8f8;
}

.server-btn-div button:hover {
    background-color: #e8e8e8;
}

.close-btn {
    padding: 8px 16px;
    cursor: pointer;
    border: none;
    background: none;
    font-size: 24px;
    color: #666;
}

.close-btn:hover {
    color: #333;
}

.image-container {
    flex: 1;
    overflow: auto;
    background-color: #000;
    display: flex;
    justify-content: center;
}

#streamedImage {
    width: 100%;
    background-color: #000;
    cursor: pointer;
}
</style>