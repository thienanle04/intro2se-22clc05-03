<script setup>
import { computed } from 'vue';
import { RouterLink, RouterView } from 'vue-router'
import userHeader from '@/components/user/userHeader.vue'
import userFooter from '@/components/user/userFooter.vue'

</script>

<template>
    <div style="background-color: #FFFAEE;">
        <userHeader />

        <RouterView />

        <userFooter />
    </div>
</template>

<script>
export default {
    name: 'UserView',
}
</script>