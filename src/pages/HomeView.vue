<template>
    <div class="flex">
        <div id="Header" class="fixed w-[420px] z-10">

            <div class="bg-[#f0f0f0] w-full flex justify-between items-center px-3 py-2">
                <img class="rounded-full ml-1 w-10" :src="userStore.picture || ''" alt="">
                <div class="flex items-center justify-center">
                    <AccountGroupIcon fillColor="#515151" class="mr-6" />
                    <DotsVerticalIcon @click="logout" fillColor="#515151" class="mr-6 cursor-pointer" />
                </div>
            </div>

            <div id="Search" class="bg-white w-full px-2 border-b shadow-sm">
                <div class="px-1 m-2 bg-[#f0f0f0] flex items-center justify-center rounded-md">
                    <MagnifyIcon fillColor="#515151" :size="18" class="ml-2" />
                    <input 
                            @click="showFindFriend = !showFindFriend"
                            type="text" class="ml-5 apperance-none w-full bg-[#f0f0f0] py-1.5 px-2.5 
                                text-gray-700 leading-tight focus:outline-none 
                                focus:shadow-outline placeholder:text-sm placeholder:text-gray-500"
                            autocomplete="off"
                            placeholder="Start a new chat"
                                 />
                        
                </div>
            </div>

        </div>

        <div v-if="showFindFriend">
            <FindFriendsView class="pt-28" />
        </div>
        <div v-else>
            <ChatView class="mt-[100px]" />     
        </div>
        <div v-if="userDataForChat.length">
            <MessageView />
        </div>
        <div v-else>
            <div class="ml-[420px] fixed w-[calc(100vw-420px)] h-[100vh] bg-gray-100 text-center">
                <div class="grid h-screen place-items-center">
                    <div>
                        <div class="w-full flex items-center justify-center">
                            <img width="375" src="w-web-not-loaded-chat.png" alt="">
                        </div>
                        <div class="text-[32px] text-gray-500 font-light mt-10">WhatsApp Web</div>
                        <div class="text-[14px] text-gray-600 mt-2">
                            <div>Send and receive messages without keeping your phone online.</div>
                            <div>Use WhatsApp on up to 4 linked devices and 1 phone at the same time.</div>
                        </div>

                    </div>
                </div>
        </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'
import ChatView from './ChatView.vue';
import MessageView from './MessageView.vue';
import FindFriendsView from './FindFriendsView.vue';

import AccountGroupIcon from 'vue-material-design-icons/AccountGroup.vue';
import DotsVerticalIcon from 'vue-material-design-icons/DotsVertical.vue';
import MagnifyIcon from 'vue-material-design-icons/Magnify.vue';
import { useUserStore } from '../stores/user-store';
import { storeToRefs } from 'pinia';


const router = useRouter();
const userStore = useUserStore();

const { showFindFriend, userDataForChat } = storeToRefs(userStore);

// let open = ref(true);
// let showFindFriend = ref(false);

onMounted(async () => {
    try{
        userStore.getAllUsers();
        await userStore.getAllChatsByUser()
    } catch(error){
        console.log('get all user error ', error);
    }
});

const logout = () => {
    let res = confirm('Are you sure you want to logout');
    if(res) userStore.logout();
    router.push('/login');
}
</script>

<style scoped>

</style>