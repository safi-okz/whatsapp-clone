<template>
  <router-view></router-view>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from './stores/user-store';;

const router = useRouter();
const userStore = useUserStore();

onMounted(() => {
  if(!userStore.sub) router.push('/login');
})
</script>