<script setup>
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

const svrNameList = ['svr10', 'svr11', 'svr20', 'svr21', 'svr30', 'svr31'];

let imageTag = null
let unitImageWidth = 0
let unitImageHeight = 0

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
    let port = 0;
    switch (gpuNum) {
      case '1' : port = 10115; break;
      case '2' : port = 10116; break;
      case '3' : port = 10117; break;
    }
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
    unitImageHeight = 154.28 // 1080 / 7
}

const zoomImage = e => {
    console.log([e.offsetX, e.offsetY])
    const indexX = Math.floor(e.offsetX / unitImageWidth)
    const indexY = Math.floor(e.offsetY / unitImageHeight)
    const indexVideo = indexX + indexY * 8
    console.log(indexVideo)    // console.log([evn])
    currentSocket.emit('reqstream', indexVideo)
}
</script>
<template>
    <Teleport to="body">
        <div v-if="show"
             class="flex fixed items-center justify-center w-full h-full top-0 left-0 z-50"
             style="background-color: rgba(0,0,0,0.5)"
             @click="closePopup"
        >
            <div class="flex flex-col w-9/10 h-9/10" @click.stop>
                <div class="flex justify-between items-center rounded-t-lg p-[7px] bg-[#fff]">
                    <div class="flex gap-[10px]">
                        <Button
                            v-for="svrName in svrNameList"
                            class="px-2 py-4 cursor-pointer rounded-sm bg-[#f8f8f8]"
                            color="#f8f8f8"
                            outlined
                            @click="setSocket(svrName)"
                        >
                            {{ svrName }}
                        </Button>
                    </div>
                    <button class="px-2 py-1 cursor-pointer text-5xl text-black text-center" @click="closePopup">×</button>
                </div>
                <div class="flex flex-1 justify-center overflow-auto bg-black rounded-b-lg">
                    <img 
                        class="cursor-pointer"
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