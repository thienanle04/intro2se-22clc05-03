<script setup>
import { computed } from 'vue';
import { RouterLink, RouterView } from 'vue-router'
import { comLogin } from '../components/user/login';
import { comSignUp } from '../components/user/signup';
</script>

<template>
  <component :is="currentComponent" @login-success=LoggedIn @go-login=goLogin @go-home=goHome @go-signup=goSignup></component>
</template>

<script>
export default {
    name: 'userView',
    data() {
        return {
            currentComponent: 'comLogin', // Current component to display
            authToken: null, // Auth token
            isLoggedIn: false, // Is user logged in
        }
    },
    provide() {
        return {
            authToken: computed(() => this.authToken), // Provide auth token to all child components
        }
    },
    computed: {
    },
    methods: {
        LoggedIn(authToken) {
            this.currentComponent = 'comHome';
            this.authToken = authToken;
            this.isLoggedIn = true;
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