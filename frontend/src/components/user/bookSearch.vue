<template>
    <div class="row my-1 w-100">
        <div class="col-12">
            <div class="d-flex justify-content-between align-items-center mb-4 mx-5">
                <!-- Header -->
                <h3 class="mb-0">{{ filteredResults.length > 0 ? 'Search Results:' : 'Search Results: None' }}</h3>

                <!-- Genre Dropdown and Filter Button -->
                <div class="d-flex align-items-center">
                    <select v-model="selectedGenre" class="form-select me-2">
                        <option value="">All Genres</option>
                        <option v-for="genre in genres" :key="genre" :value="genre">{{ genre }}</option>
                    </select>
                    <button class="btn btn-primary" @click="filterByGenre">Filter</button>
                </div>
            </div>

            <!-- Display Search Results -->
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4 mx-5">
                <div v-for="book in currentPageBooks" :key="book.id" class="col">
                    <div class="card text-center" style="width: 200px;">
                        <!-- Image -->
                        <img :src="book.image" class="card-img-top" alt="book.title" @click="goToBookDetails(book._id)"
                            style="height: 270px; width: 200px;object-fit: fill;" />
                        <div class="card-body" style="width: 200px;">
                            <!-- Title -->
                            <h5 class="card-title" @click="goToBookDetails(book._id)"
                                style="font-size: 16px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                {{ book.title }}
                            </h5>
                            <!-- Authors -->
                            <p class="card-text" style="font-size: 14px;">
                                {{ book.author }}
                            </p>
                            <!-- Rating -->
                            <div class="card-rating" style="font-size: 14px; color: #f39c12;">
                                {{ book.rating.toFixed(1) }}⭐
                            </div>
                            <!-- Price & Add to Cart -->
                            <div class="card-price text-center text-danger">
                                <button class="btn" @click="this.$store.dispatch('addToCart', { book: book });">
                                    <i class="bi bi-cart3 fs-4"></i>
                                </button>
                                {{ book.price }}$
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Pagination Controls -->
        <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
                <!-- Previous Button -->
                <li class="page-item" :class="{ disabled: currentPage <= 1 }">
                    <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>

                <!-- Page Numbers -->
                <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: page === currentPage }">
                    <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
                </li>

                <!-- Next Button -->
                <li class="page-item" :class="{ disabled: currentPage >= totalPages }">
                    <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script>
export default {
    name: 'BookSearch',
    props: {
        searchText: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            allBooks: [],
            searchResults: [],
            selectedGenre: '',
            genres: ['Fantasy', 'Adventure', 'Classic', 'Romance', 'Dystopian', 'ComingOfAge', 'LiteraryFiction'],
            filteredResults: [],
            currentPage: 1,
            itemsPerPage: 10,
            totalPages: 1
        };
    },
    watch: {
        searchText: 'fetchSearchResults',
        filteredResults: 'calculatePagination'
    },
    methods: {
        async fetchAllBooks() {
            try {
                const response = await fetch('/api/v1/books');
                const result = await response.json();

                if (result?.data?.books && Array.isArray(result.data.books)) {
                    this.allBooks = result.data.books;
                } else {
                    console.error('Unexpected data format:', result);
                    this.allBooks = []; // Default to an empty array
                }
            } catch (error) {
                console.error('Error fetching books:', error);
                this.allBooks = []; // Default to an empty array on error
            }
        },
        fetchSearchResults() {
            if (!Array.isArray(this.allBooks)) {
                console.error('allBooks is not an array:', this.allBooks);
                this.searchResults = [];
                return;
            }

            const searchTextLower = this.searchText.toLowerCase();
            const results = [];

            this.allBooks.forEach((book) => {
                const titleMatches = book.title?.toLowerCase().includes(searchTextLower);
                const authorMatches = book.author?.toLowerCase().includes(searchTextLower);

                if ((titleMatches || authorMatches) && !results.find((b) => b._id === book._id)) {
                    results.push(book);
                }
            });

            this.searchResults = results;
            this.filteredResults = results; // Initialize filteredResults to show all searchResults
            this.calculatePagination(); // Calculate pagination on search result change
        },
        filterByGenre() {
            if (this.selectedGenre === '') {
                this.filteredResults = this.searchResults;
            } else {
                this.filteredResults = this.searchResults.filter((book) =>
                    book.genre?.toLowerCase() === this.selectedGenre.toLowerCase()
                );
            }
            this.calculatePagination(); // Recalculate pagination after filtering
        },
        calculatePagination() {
            this.totalPages = Math.ceil(this.filteredResults.length / this.itemsPerPage);
            this.changePage(1); // Reset to the first page after filtering or searching
        },
        changePage(page) {
            if (page < 1 || page > this.totalPages) return; // Prevent going out of bounds
            this.currentPage = page;
        },
        /**
         * Navigates to the Book Details page with the given ID.
         * @param {string} id - The ID of the book to view details.
         */
        goToBookDetails(id) {
            this.$router.push({ name: 'BookDetails', params: { id } });
        },
    },
    computed: {
        currentPageBooks() {
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            return this.filteredResults.slice(startIndex, startIndex + this.itemsPerPage);
        }
    },
    async created() {
        await this.fetchAllBooks();
        this.fetchSearchResults();
        this.filterByGenre();
    }
};
</script>

<style scoped>
.title {
    font-size: 16px;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.card-rating {
    font-size: 14px;
    color: #f39c12;
}

.card-price {
    font-size: 16px;
}
</style>
