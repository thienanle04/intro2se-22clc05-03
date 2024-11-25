<template>
    <div class="row full-header">
        <div class="col-12">
            <nav class="navbar bg-white border-bottom shadow-sm">
                <div class="container-fluid" style="position: relative;">
                    <!-- Top Section -->
                    <div class="row w-100 align-items-start" style="height: 50px;">
                        <!-- Left Section: Logo -->
                        <div class="col-2 d-flex align-items-start">
                            <a href="#" class="text-dark d-flex align-items-center" style="text-decoration: none;">
                                <span style="font-size: 3rem; line-height: 0.7;">📚</span>
                                <span style="font-weight: bold; color: #dc3545; margin-left: 0.7rem;">BOOKSHOP</span>
                            </a>
                        </div>
                        <!-- Center Section: Search Bar -->
                        <div class="col-8 d-flex justify-content-center">
                            <form class="d-flex w-75" role="search">
                                <input v-model="searchQuery" class="form-control px-4" type="search"
                                    placeholder="🔍 Search book titles, authors, publishers..." aria-label="Search" />
                            </form>
                        </div>

                        <!-- Right Section: Icons -->
                        <div class="col-2 d-flex justify-content-end align-items-center">
                            <a href="#" class="text-dark me-3">
                                <span>Login</span>
                            </a>
                            <span class="text-dark me-3">|</span>
                            <a href="#" class="text-dark me-3">
                                <i class="bi bi-cart3 fs-4"></i>
                            </a>
                            <span class="text-dark me-3">|</span>
                            <a href="#" class="text-dark">
                                <i class="bi bi-person fs-4"></i>
                            </a>
                        </div>
                    </div>

                    <!-- Categories (Responsive) -->
                    <div class="row w-100 mt-3 categories">
                        <button class="btn btn-outline-secondary rounded-pill mx-2 mb-2 category-button">
                            <i class="bi bi-book me-1"></i> Action
                        </button>
                        <button class="btn btn-outline-secondary rounded-pill mx-2 mb-2 category-button">
                            <i class="bi bi-film me-1"></i> Adventure
                        </button>
                        <button class="btn btn-outline-secondary rounded-pill mx-2 mb-2 category-button">
                            <i class="bi bi-emoji-smile me-1"></i> Comedy
                        </button>
                        <button class="btn btn-outline-secondary rounded-pill mx-2 mb-2 category-button">
                            <i class="bi bi-shield-shaded me-1"></i> Crime
                        </button>
                        <button class="btn btn-outline-secondary rounded-pill mx-2 mb-2 category-button">
                            <i class="bi bi-tv me-1"></i> Drama
                        </button>
                        <button class="btn btn-outline-secondary rounded-pill mx-2 mb-2 category-button">
                            <i class="bi bi-lightning me-1"></i> Thriller
                        </button>
                        <button class="btn btn-danger rounded-pill mx-2 mb-2 category-button">
                            View All
                        </button>
                    </div>
                </div>
            </nav>
        </div>
    </div>
</template>


<style scoped>
    .full-header {
        height: 100px;
    }

    .categories {
        position: absolute;
        top: 30px;
        left: 0;
        width: 100%;
        z-index: 1;
        display: flex;
        justify-content: center;
    }

    /* Hide categories when the screen width is smaller than 768px */
    @media (max-width: 1000px) {
        .categories {
            display: none;
        }

        .full-header {
            height: 80px;
        }

    }

    /* Categories button alignment */
    .category-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.3rem;
        font-size: 0.8rem;
        width: 10%;
    }
</style>

<script>
import { RouterLink } from 'vue-router';
export default {
    name: 'userHeader',
    data() {
        return {
        }
    },
    methods: {

    }
}
</script>
