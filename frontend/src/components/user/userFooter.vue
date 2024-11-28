<template>
    <nav class="navbar navbar-expand-lg bg-white shadow-lg my-4">
        <div class="container-fluid">
            <!-- Left Section -->
            <div class="d-flex flex-column align-items-start">
                <a href="#" class="text-dark mb-2" style="text-decoration: none;">Contact</a>
                <a href="#" class="text-dark" style="text-decoration: none;">Return and Refund Policy</a>
            </div>

            <!-- Center Section -->
            <div class="text-center mx-auto">
                <div class="mb-1" style="font-size: 20px; font-weight: bold;">Follow us on</div>
                <div>
                    <a href="#" class="text-dark me-3" style="font-size: 1.5rem; text-decoration: none;">
                        <i class="bi bi-facebook"></i>
                    </a>
                    <a href="#" class="text-dark" style="font-size: 1.5rem; text-decoration: none;">
                        <i class="bi bi-instagram"></i>
                    </a>
                </div>
            </div>

            <!-- Right Section -->
            <div class="d-flex flex-column align-items-center">
                <a href="#" class="text-dark d-flex flex-column align-items-center" style="text-decoration: none;">
                    <span style="font-size: 3rem; line-height: 0.7;">📚</span>
                    <span style="font-weight: bold; color: #dc3545; margin-top: 0.5rem;">BOOKSHOP</span>
                </a>
            </div>
        </div>
    </nav>
</template>

<style scoped>
/* Add spacing between sections */
    body {
        margin: 0;
        padding: 0;
    }
    .navbar {
        border-radius: 0.5rem; /* Optional: Add rounded corners for better styling */
    }
    .my-4 {
        margin-top: 1.5rem; /* Adds gap between navbar and top section */
        margin-bottom: 1.5rem; /* Adds gap below navbar */
    }
</style>

<script>
import { RouterLink } from 'vue-router';
export default {
    name: 'userFooter',
    data() {
        return {};
    },
    methods: {}
};
</script>
