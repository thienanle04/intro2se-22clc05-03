<script setup>
import { computed } from 'vue';
import { RouterLink, RouterView } from 'vue-router'
import userHeader from '@/components/user/userHeader.vue'
</script>

<template>
    <div>
        <userHeader />

        <RouterView />

    </div>
</template>

<script>
export default {
    name: 'UserView',
}
</script>