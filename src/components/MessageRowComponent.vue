<template>
    <div :class="isActive ? 'bg-gray-200' : ''">
        <div class="flex w-full px-4 py-3 items-center cursor-pointer">
            <img class="rounded-full mr-4 w-12 h-12" :src="chat.user.picture || ''" alt="">

            <div class="w-full">
                <div class="flex justify-between items-center">
                <div class="text-[15px] text-gray-600">
                    {{ chat.user.firstName }}
                </div>
                <div class="text-[12px] text-gray-600">
                    {{ lastCreatedAt(chat) }}
                </div>
            </div>

            <div class="flex items-center">
                <CheckAllIocn :size="18" :fillColor="tickColor(chat)" class="mr-1" />
                <div class="text-[15px] w-full items-center justify-between text-gray-500">
                    {{ lastChatMessage(chat) }}...
                </div>
            </div>
            </div>            
        </div>

        <div class="border-b w-[calc(100%-80px)] float-right">

        </div>
    </div>
</template>

<script setup>
import CheckAllIocn from 'vue-material-design-icons/CheckAll.vue';
import { toRefs, computed } from 'vue';
import moment from 'moment';
import { useUserStore } from '../stores/user-store';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();

const { sub, userDataForChat } = storeToRefs(userStore);

const props = defineProps({chat: Object});
const { chat } = toRefs(props);

const isActive = computed(() => {
    if(userDataForChat.value.length){
        if(userDataForChat.value[0].sub1 === chat.value.user.sub){
            return true;
        }
        if(userDataForChat.value[0].sub2 === chat.value.user.sub){
            return true;
        }
    }
    return false;
})

const tickColor = (chat) => {
    let color = '';
    if(chat.sub1 === sub.value){
        if(chat.sub1HasViewed) color = '#7df9ff';
        else color = '#b5b5b5';
    }
    if(chat.sub2 === sub.value){
        if(chat.sub2HasViewed) color = '#7df9ff';
        else color = '#b5b5b5';
    }
    return color;
}

const lastChatMessage = (chat) => {
    return chat.messages[chat.messages.length - 1].message.substring(0, 20);
}

const lastCreatedAt = (chat) => {
    if(chat.messages.length){
        return moment(chat.messages[chat.messages.length - 1].createdAt).format('MMM D YY | HH:MM A')
    }
}
</script>

<style scoped>

</style>