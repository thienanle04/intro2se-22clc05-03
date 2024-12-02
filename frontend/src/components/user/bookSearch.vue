<template>
    <div class="row my-1 w-100">
        <div class="col-12">
            <!-- Display Search Result Header with conditional message -->
            <h3 class="mx-5">{{ searchResults.length > 0 ? 'Search Results:' : 'Search Results: None' }}</h3>

            <!-- Display Search Results -->
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-6 g-4 mx-5">
                <div v-for="book in searchResults" :key="book.id" class="col">
                    <div class="card text-center mx-auto" style="width: 200px;">
                        <!-- Image -->
                        <img :src="book.image" class="card-img-top" alt="book.title" @click="goToBookDetails(book._id)"
                            style="height: 270px; width: 200px;object-fit: fill;" />
                        <div class="card-body" style="min-width: 200px;">
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
                                {{ book.rating }}⭐
                            </div>
                            <!-- Price & Add to Cart -->
                            <div class="card-price text-center text-danger">
                                <button class="btn"  @click="this.$store.dispatch('addToCart', { book: book });">
                                    <i class="bi bi-cart3 fs-4"></i>
                                </button>
                                {{ book.price }}$
                            </div>
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
