<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { comLogin } from './components/login';
import { comSignUp } from './components/signup';
</script>

<template>
  <component :is="currentComponent" @login-success=LoggedIn @go-login=goLogin @go-home=goHome @go-signup=goSignup></component>
</template>

<script>
export default {
    data() {
        return {
            token: null,
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
        LoggedIn(data) {
            this.currentComponent = 'comHome';
            this.user = data;
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
    components: { comLogin, comSignUp },
  }
</script>