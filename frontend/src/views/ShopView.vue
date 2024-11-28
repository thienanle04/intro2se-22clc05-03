<script setup>
import { RouterLink, RouterView } from 'vue-router'
import adminHeader from '../components/shop/adminHeader.vue';
</script>

<template>
    <div>
        <adminHeader />       
        <routerView />
    </div>
</template>

<script>
export default {
    name: "ShopView",
};
</script>