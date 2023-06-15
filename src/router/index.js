import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: '/',
        name: 'HomeView',
        component: () => import('../pages/HomeView.vue')
    },
    {
        path: '/login',
        name: 'LoginView',
        component: () => import('../pages/LoginView.vue')
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;