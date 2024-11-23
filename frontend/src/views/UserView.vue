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
    name: 'userView',
    data() {
        return {
            currentComponent: 'comHome', // Current component to display
        }
    },
    provide() {
        return {
        }
    },
    computed: {
    },
    methods: {
        LoggedIn() {
            this.currentComponent = 'comHome';
        },
        goLogin() {
            this.currentComponent = 'comLogin';
        },
        goHome() {
            this.currentComponent = 'comHome';
        },
        goSignup() {
            this.currentComponent = 'comSignUp';
        },
    },
  }
</script>