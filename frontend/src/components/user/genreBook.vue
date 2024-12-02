<template>
    <div>
        <!-- Display Category Header with conditional message -->
        <h3>Category: {{ this.$route.params.genre }}</h3>

        <!-- Display Books -->
        <div class="row">
            <div v-for="book in books" :key="book.id" class="col-md-3 mb-4">
                <div class="card search-result-card text-center" @click="goToBookDetails(book._id)">
                    <!-- Book Image -->
                    <img :src="book.image" class="card-img-top mx-auto" alt="book.title" style="object-fit: fill;" />
                    <div class="card-body">
                        <!-- Book Title -->
                        <h5 class="title"
                            style="font-size: 16px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                            {{ book.title }}
                        </h5>
                        <!-- Book Author -->
                        <p class="card-text" style="font-size: 14px;">
                            {{ book.author }}
                        </p>
                        <!-- Book Rating -->
                        <div class="card-rating" style="font-size: 14px; color: #f39c12;">
                            {{ book.rating }}⭐
                        </div>
                        <!-- Book Price -->
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
    name: 'GenreBooks',
    data() {
        return {
            books: [],
        };
    },
    methods: {
        async fetchBooks() {
            try {
                const genre= this.$route.params.genre;
                const response = await fetch(`http://localhost:8081/api/v1/books/search/${genre}`);
                if (response.ok) {
                    const res = await response.json();
                    console.log("Genre books:", res);
                    // Filter out the current book
                    this.books = res.data.books;
                } else {
                    console.error('Error:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('Error fetching relative books:', error.message);
            }
        },
        /**
         * Navigates to the Book Details page with the given ID.
         * @param {string} id - The ID of the book to view details.
         */
         goToBookDetails(id) {
            this.$router.push({ name: 'BookDetails', params: { id } });
        },
    },
    mounted() {
        this.fetchBooks();
    },
    watch: {
        '$route.params.genre': function (newGenre) {
            this.genre = newGenre; // Update genre when route changes
            this.fetchBooks(); // Refetch books for the new genre
        },
    },

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
