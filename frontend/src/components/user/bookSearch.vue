<template>
    <div>
        <!-- Display Search Result Header with conditional message -->
        <h3>{{ searchResults.length > 0 ? 'Search Results:' : 'Search Results: None' }}</h3>
        
        <!-- Display Search Results -->
        <div class="row">
            <div v-for="book in searchResults" :key="book.id" class="col-md-3 mb-4">
                <div class="card search-result-card text-center" @click="goToBookDetails(book._id)">
                    <!-- Image -->
                    <img :src="book.image" class="card-img-top mx-auto" alt="book.title" />
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
            searchResults: []
        };
    },
    watch: {
        searchText: 'fetchSearchResults'
    },
    methods: {
        async fetchAllBooks() {
            try {
                const response = await fetch('http://localhost:8081/api/v1/books');
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
                const authorMatches = book.author?.toLowerCase().includes(searchTextLower)

                // Use _id to avoid duplicates and check if the book is not already in results
                if ((titleMatches || authorMatches) && !results.find((b) => b._id === book._id)) {
                    results.push(book);
                }
            });

            console.log('Search results:', results); // Log all matched books
            this.searchResults = results;
        },
        /**
         * Navigates to the Book Details page with the given ID.
         * @param {string} id - The ID of the book to view details.
         */
         goToBookDetails(id) {
            this.$router.push({ name: 'BookDetails', params: { id } });
        },
    },

    async created() {
        await this.fetchAllBooks();
        this.fetchSearchResults();
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
