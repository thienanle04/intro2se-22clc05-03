<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-4">
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


        <!-- Display Filtered Search Results -->
        <div class="row">
            <div v-for="book in currentPageBooks" :key="book.id" class="col-md-3 mb-4">
                <div class="card search-result-card text-center" @click="goToBookDetails(book._id)">
                    <!-- Image -->
                    <img :src="book.image" class="card-img-top mx-auto" alt="book.title" style="object-fit: fill;" />
                    <div class="card-body">
                        <!-- Title -->
                        <h5 class="title"
                            style="font-size: 16px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                            {{ book.title }}
                        </h5>
                        <!-- Authors -->
                        <p class="card-text" style="font-size: 14px;">
                            {{ book.author }}
                        </p>
                        <!-- Rating -->
                        <div class="card-rating" style="font-size: 14px; color: #f39c12;">
                            {{ book.rating }}⭐
                        </div>
                        <!-- Price & Add to Cart -->
                        <div class="card-price text-center text-danger">
                            <a href="#" class="text-dark me-3">
                                <i class="bi bi-cart3 fs-4"></i>
                            </a>
                            {{ book.price }}$
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
            genres: ['Fantasy', 'Adventure', 'Classic', 'Romance', 'Dystopian', 'ComingOfAge'],
            filteredResults: [],
            currentPage: 1,
            itemsPerPage: 8,
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
        }
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
.search-result-card {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    height: 450px;
    justify-content: space-between;
}

.card-img-top {
    height: 300px;
    width: 250px;
    object-fit: cover;
}

.card-body {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

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
