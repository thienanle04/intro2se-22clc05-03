<script setup>
import { computed } from 'vue';
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
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