<template>
    <div class="row justify-content-center w-100 my-5">
        <div class="col-10 col-md-8 justify-content-center d-flex">
            <div class="card shadow">
                <div class="card-body">
                    <h2 class="text-center mb-4">Login</h2>
                    <form id="loginForm" @submit.prevent="login">
                        <!-- Username Input -->
                        <div class="mb-3">
                            <label for="username" class="form-label">Username</label>
                            <input type="text" class="form-control" id="username" placeholder="Enter your username"
                                required>
                        </div>
                        <!-- Password Input -->
                        <div class="mb-3">
                            <label for="password" class="form-label">Password</label>
                            <input type="password" class="form-control" id="password" placeholder="Enter your password"
                                required>
                        </div>

                        <div id="loginError"></div>
                        
                        <!-- Privacy Notice -->
                        <p class="small mb-4">
                            By creating an account, you agree to Bookshop.org's
                            <a href="#" class="text-danger">Privacy Notice</a> and
                            <a href="#" class="text-danger">Terms of Use</a>.
                        </p>
                        <!-- Login Button -->
                        <div class="d-grid">
                            <button type="submit" class="btn btn-danger btn-lg">LOGIN</button>
                        </div>
                        <!-- Links -->
                        <div class="text-center mt-3">
                            <span>or </span>
                            <RouterLink to="/signup" class="text-decoration-none">Create a new account</RouterLink>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { RouterLink } from 'vue-router';
export default {
    name: 'Login',
    data() {
        return {
        }
    },
    methods: {
        async login() {
            $.post('/api/v1/auth/login', {
                username: $('#username').val(),
                password: $('#password').val()
            }, (res) => {
                if (res.code == 1) {
                    // Redirect to home page
                    $('div#loginError').replaceWith('<div id="loginError"></div>');
                    
                    this.$store.dispatch('login', { authToken: res.data, role: res.role, userId: res.userId });

                    if (res.role == 'admin') {
                        this.$router.push('/shop'); 
                    } else if (res.role == 'customer') {
                        this.$router.push('/');
                    }
                } else {
                    // Display error message 
                    console.log("Login failed");
                    $('#loginError').addClass('alert alert-danger').text("Login failed").attr('role', 'alert');
                }
            }).fail((err) => {
                const message = err?.responseJSON?.message ?? 'Login failed';
                $('#loginError').addClass('alert alert-danger').text(message).attr('role', 'alert');
            });
        }
    }
}
</script>
