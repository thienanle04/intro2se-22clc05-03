<template>
    <div class="row justify-content-center w-100">
        <div class="col-md-10">
            <h4 class="text-center mb-3">Random Books</h4>
            <div class="book-list">
                <!-- Display 4 random books -->
                <div v-for="(book, index) in randomBooks" :key="index" class="book-item d-flex align-items-center mb-3"
                style="cursor: pointer;">
                    <!-- Book Image -->
                    <img :src="book.image" :alt="book.title" class="book-image me-3" @click="goToBookDetails(book._id)" />

                    <!-- Book Details -->
                    <div class="book-details flex-grow-1" @click="goToBookDetails(book._id)">
                        <h5 class="mb-1 book-title">{{ book.title }}</h5>
                        <p class="mb-1 text-muted book-author">{{ book.author }}</p>
                        <p class="mb-2 book-description">
                            {{ book.description }}
                        </p>
                    </div>

                    <!-- Price and Cart -->
                    <div class="book-actions text-center">
                        <button @click="this.$store.dispatch('addToCart', { book: book });" class="btn" role="button">
                            <i class="bi bi-cart3 fs-4"></i>
                        </button>
                        <p class="text-danger mb-0">{{ book.price }}$</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
export default {
    name: "RandomBooks",
    inject: ['books'],
    data() {
        return {
            randomBooks: [], // Four random books to display
        };
    },
    methods: {
        /**
         * Navigates to the Book Details page with the given ID.
         * @param {string} id - The ID of the book to view details.
         */
         goToBookDetails(id) {
            this.$router.push({ name: 'BookDetails', params: { id } });
        },
    },
    mounted() {
        this.randomBooks = this.books.sort(() => 0.5 - Math.random()).slice(0, 4);
    },
};
</script>



<style scoped>
.book-item {
    border: 1px solid #ddd;
    padding: 15px;
    border-radius: 8px;
    background-color: #fff;
    transition: box-shadow 0.2s ease-in-out;
}

.book-item:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.book-image {
    width: 80px;
    height: 120px;
    object-fit: cover;
    border-radius: 5px;
}

.book-title {
    font-weight: bold;
    font-size: 1rem;
}

.book-author {
    font-size: 0.9rem;
}

.book-description {
    font-size: 0.85rem;
    color: black;
    max-width: 95%; /* Control the width of the description */
    overflow: hidden; /* Hide overflow text */
    text-overflow: ellipsis; /* Add ellipsis (...) when the text overflows */
    display: -webkit-box; /* Use flexbox for line clamping */
    text-align: justify; /* Justify the text */
    -webkit-line-clamp: 3; /* Limit to 3 lines (you can adjust this number) */
    line-clamp: 3; /* Standard property for compatibility */
    -webkit-box-orient: vertical; /* Align text vertically */
    word-wrap: break-word; /* Allow long words to break and wrap */
}

.book-actions {
    text-align: center;
}

.book-actions p {
    font-size: 0.9rem;
    font-weight: bold;
}
</style>
