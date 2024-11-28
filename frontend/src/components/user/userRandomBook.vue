<template>
    <div class="row justify-content-center">
        <div class="col-md-10">
            <h4 class="text-center mb-3">Random Books</h4>
            <div class="book-list">
                <!-- Display 4 random books -->
                <div v-for="(book, index) in randomBooks" :key="index" class="book-item d-flex align-items-center mb-3"
                style="cursor: pointer;" @click="goToBookDetails(book._id)">
                    <!-- Book Image -->
                    <img :src="book.image" :alt="book.title" class="book-image me-3" />

                    <!-- Book Details -->
                    <div class="book-details flex-grow-1">
                        <h5 class="mb-1 book-title">{{ book.title }}</h5>
                        <p class="mb-1 text-muted book-author">{{ book.author }}</p>
                        <p class="mb-2 text-truncate book-description" style="max-width: 70%;">
                            {{ book.description }}
                        </p>
                    </div>

                    <!-- Price and Cart -->
                    <div class="book-actions text-center">
                        <a href="#" class="text-dark me-3">
                            <i class="bi bi-cart3 fs-4"></i>
                        </a>
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
    data() {
        return {
            books: [], // All books fetched from the API
            randomBooks: [], // Four random books to display
        };
    },
    methods: {
        /**
         * Fetches books data from the API and selects 4 random books.
         */
        async fetchBooks() {
            try {
                const response = await fetch("http://localhost:8081/api/v1/books");

                if (response.ok) {
                    const res = await response.json();
                    this.books = res.data.books;

                    // Randomly select 4 books
                    this.randomBooks = this.getRandomBooks(this.books, 4);
                } else {
                    console.error("Error:", response.status, response.statusText);
                }
            } catch (error) {
                console.error("Error fetching books data:", error.message);
            }
        },

        /**
         * Returns a random selection of books.
         * @param {Array} books - The array of books to select from.
         * @param {number} count - The number of random books to select.
         * @returns {Array} An array of randomly selected books.
         */
        getRandomBooks(books, count) {
            const shuffled = books.sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count);
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
        this.fetchBooks(); // Fetch books on component mount
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
}

.book-actions {
    text-align: center;
}

.book-actions p {
    font-size: 0.9rem;
    font-weight: bold;
}
</style>
