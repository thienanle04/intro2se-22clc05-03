<template>
    <div class="row justify-content-center w-100 my-3">
        <div class="col-10 col-md-8 justify-content-center d-flex">
            <div class="card shadow">
                <div class="card-body">
                    <h2 class="text-center mb-4">Create a new account</h2>
                    <form id="signupForm" @submit.prevent="signup">
                        <!-- Username Input -->
                        <div class="mb-3">
                            <label for="username" class="form-label">Username</label>
                            <input type="text" class="form-control" id="username" placeholder="Enter your username">
                        </div>
                        <!-- Password Input -->
                        <div class="mb-3">
                            <label for="password" class="form-label">Password</label>
                            <input type="password" class="form-control" id="password" placeholder="Enter your password">
                        </div>
                        <!-- Name Input -->
                        <div class="mb-3">
                            <label for="name" class="form-label">Name</label>
                            <input type="text" class="form-control" id="name" placeholder="Enter your full name">
                        </div>
                        <!-- Email Input -->
                        <div class="mb-3">
                            <label for="email" class="form-label">Email</label>
                            <input type="email" class="form-control" id="email" placeholder="Enter your email">
                        </div>
                        <div id="signupError"></div>
                        <!-- Privacy Notice -->
                        <p class="small mb-4">
                            By creating an account, you agree to Bookshop.org's
                            <a href="#" class="text-danger">Privacy Notice</a> and
                            <a href="#" class="text-danger">Terms of Use</a>.
                        </p>
                        <!-- Login Button -->
                        <div class="d-grid">
                            <button type="submit" class="btn btn-danger btn-lg">CREATE</button>
                        </div>
                        <!-- Links -->
                        <div class="text-center mt-3">
                            <span>or </span>
                            <router-link to="/login" class="text-decoration-none">Login as Existing Customer</router-link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { RouterLink } from "vue-router";

export default {
    name: "Signup",
    data() {
        return {
        }
    },
    methods: {
        signup() {
            $.post('/api/v1/auth/signup', {
                username: $('#username').val(),
                password: $('#password').val(),
                name: $('#name').val(),
                email: $('#email').val()
            }, (res) => {
                console.log(res);
                if (res.code == 1) {
                    $('div#signupError').replaceWith('<div id="loginError"></div>');
                    this.$router.push('/login');
                } else {
                    $('#loginError').html('<div class="alert alert-danger">Signup failed</div>');
                }
            })
            .fail((err) => {
                $('#signupError').html(`<div class="alert alert-danger">${err.responseJSON.message}</div>`);
            });
        }
    }
}
</script>