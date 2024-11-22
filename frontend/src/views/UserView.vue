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
    name: 'userView',
    data() {
        return {
            currentComponent: 'comLogin', // Current component to display
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