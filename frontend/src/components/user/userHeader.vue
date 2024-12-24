<template>
    <nav class="navbar mt-2 bg-white border-bottom shadow-sm sticky-top">
        <div class="container-fluid" style="position: relative;">
            <!-- Top Section -->
            <div class="row w-100 align-items-start" style="height: 50px;">
                <!-- Left Section: Logo -->
                <div class="col-2 d-flex align-items-start">
                    <RouterLink to="/" class="text-dark d-flex align-items-center" style="text-decoration: none;">
                        <span style="font-size: 3rem; line-height: 0.7;">📚</span>
                        <span style="font-weight: bold; color: #dc3545; margin-left: 0.7rem;">BOOKSHOP</span>
                    </RouterLink>
                </div>
                <!-- Center Section: Search Bar -->
                <div class="col-8 d-flex justify-content-center">
                    <form class="d-flex w-75" role="search">
                        <input class="form-control px-4" type="search"
                            placeholder="🔍 Search book titles, authors, publishers..." v-model="searchInput"
                            aria-label="Search" />
                        <button class="btn btn-outline-success mx-3" type="submit"
                            @click="performSearch">Search</button>
                    </form>
                </div>

                <!-- Right Section: Icons -->
                <div class="col-2 d-flex justify-content-end align-items-center">
                    <RouterLink to="/login" class="text-dark me-3" v-if="!isAuthenticated">
                        <span>Login</span>
                    </RouterLink>
                    <button @click="this.$store.commit('logout')" class="text-dark me-3 no-style"
                        v-if="isAuthenticated">
                        <span>Log out</span>
                    </button>
                    <span class="text-dark me-3">|</span>
                    <RouterLink to="/cart" class="text-dark me-3">
                        <i class="bi bi-cart3 fs-4"></i>
                    </RouterLink>
                    <span class="text-dark me-3">|</span>
                    <RouterLink to="/myOrders" class="text-dark">
                        <i class="bi bi-clock-history fs-4"></i>

                    </RouterLink>
                </div>
            </div>

            <!-- Categories (Responsive) -->
            <div class="row w-100 justify-content-center categories">
                <button class="btn btn-outline-secondary rounded-pill mx-2 mb-2 category-button"
                    @click="performGenre('Fantasy')">
                    <i class="bi bi-book-half me-1"></i> Fantasy
                </button>
                <button class="btn btn-outline-secondary rounded-pill mx-2 mb-2 category-button"
                    @click="performGenre('Adventure')">
                    <i class="bi bi-geo me-1"></i> Adventure
                </button>
                <button class="btn btn-outline-secondary rounded-pill mx-2 mb-2 category-button"
                    @click="performGenre('Classic')">
                    <i class="bi bi-journal-richtext me-1"></i> Classic
                </button>
                <button class="btn btn-outline-secondary rounded-pill mx-2 mb-2 category-button"
                    @click="performGenre('Romance')">
                    <i class="bi bi-heart me-1"></i> Romance
                </button>
                <button class="btn btn-outline-secondary rounded-pill mx-2 mb-2 category-button"
                    @click="performGenre('Dystopian')">
                    <i class="bi bi-exclamation-circle me-1"></i> Dystopian
                </button>
                <button class="btn btn-outline-secondary rounded-pill mx-2 mb-2 category-button"
                    @click="performGenre('ComingOfAge')">
                    <i class="bi bi-person-fill me-1"></i> ComingOfAge
                </button>
                <button class="btn btn-danger rounded-pill mx-2 mb-2 category-button" @click="performGenre('All')">
                    View All
                </button>
            </div>
        </div>
    </nav>
</template>



<style scoped>
.no-style {
    all: unset;
    /* Remove all default button styles */
    display: inline-block;
    /* Make the button behave like a block-level element */
    font-size: 1rem;
    /* Optional: Set the text size like a <p> tag */
    margin: 0;
    /* Optional: Reset any margin */
    padding: 0;
    /* Optional: Remove padding */
    cursor: pointer;
    /* Make it look like a clickable element */
    text-decoration: underline;
    /* Remove the underline by default */
}

.full-header {
    height: 100px;
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
export default {
    name: 'userHeader',
    data() {
        return {
            searchInput: '',
        }
    },
    computed: {
        isAuthenticated() {
            return this.$store.getters.isAuthenticated;
        },
    },
    methods: {
        performSearch(event) {
            event.preventDefault();
            if (this.searchInput.trim()) {
                this.$router.push({ name: 'SearchResults', query: { q: this.searchInput } });
            }
        },
        performGenre(genre) {
            this.$router.push({ name: 'GenreBooks', params: { genre } });
        },
    },

};
</script>
