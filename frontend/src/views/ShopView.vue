<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue';
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
    data() {
        return {
            books: [],
        };
    },
};
</script>