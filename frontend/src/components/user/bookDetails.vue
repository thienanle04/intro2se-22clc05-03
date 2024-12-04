<template>
    <div class="book-details-container" v-if="book">
        <div class="row justify-content-center">
            <!-- Book Image Card -->
            <div class="col-md-3">
                <div class="card text-center shadow">
                    <img :src="book.image" :alt="book.title" class="card-img-top book-image" />
                    <div class="card-body">
                        <h5 class="card-title">{{ book.title }}</h5>
                    </div>
                </div>
            </div>

            <!-- Book Information Card -->
            <div class="col-md-6">
                <div class="card shadow">
                    <div class="card-body">
                        <h5 class="card-title">{{ book.title }}</h5>
                        <p class="card-text author">Author: <strong>{{ book.author }}</strong></p>
                        <p class="card-text rating">
                            <span class="stars">
                                {{ displayStars(book.rating) }}
                            </span>
                            <span>({{ book.rating.toFixed(1) }} rating)</span>
                        </p>
                        <p class="card-text genre">Genre: <strong>{{ book.genre }}</strong></p>
                        <p class="card-text description">{{ book.description }}</p>
                    </div>
                </div>
            </div>

            <!-- Price and Cart Card -->
            <div class="col-md-3">
                <div class="card text-center shadow">
                    <div class="card-body">
                        <h5 class="card-title price">{{ book.price }}$</h5>
                        <button class="btn btn-danger mt-3"  @click="this.$store.dispatch('addToCart', { book: book });">
                            <i class="bi bi-cart3 fs-4"></i>
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="row justify-content-center">
            <div class="col-md-11">
                <div class="position-relative mb-3">
                    <h4 class="text-center mb-0">Relative Books</h4>

                    <a href="#" class="text-danger small position-absolute" style="top: 20px; right: 0;">View All</a>
                </div>
                <div>
                    <div id="RelativeCarousel" class="carousel carousel-dark slide" data-bs-ride="carousel">
                        <div class="carousel-inner d-flex align-items-center " style="height: 450px;">
                            <!-- Group items in sets of 4 -->
                            <div v-for="(chunk, chunkIndex) in chunkArray(relativeBook.data?.books || [], 4)"
                                :key="chunkIndex" class="carousel-item" :class="{ active: chunkIndex === 0 }">
                                <div class="d-flex justify-content-center">
                                    <!-- Loop through the chunk of 4 items -->
                                    <div v-for="(item, itemIndex) in chunk" :key="`${chunkIndex}-${itemIndex}`"
                                        class="card mx-4 col-md-2" style="cursor: pointer;"
                                        @click="goToBookDetails(item._id)">
                                        <img :src="item.image" :alt="item.title" class="card-img-top"
                                            style="height: 250px; object-fit: fill;" />
                                        <div
                                            class="card-body-relative d-flex flex-column justify-content-center align-items-center">
                                            <div class="card-title-relative text-center">
                                                {{ item.title }}
                                            </div>
                                            <div class="card-author-relative text-center mb-2" style="font-size: 14px;">
                                                {{ item.author }}
                                            </div>
                                            <div class="card-rating text-center mb-2" style="font-size: 14px;">
                                                {{ item.rating }}⭐
                                            </div>
                                            <div class="card-price-relative text-center text-danger">
                                                <a href="#" class="text-dark me-3">
                                                    <i class="bi bi-cart3 fs-4"></i>
                                                </a>
                                                {{ item.price }}$
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Carousel controls -->
                        <button class="carousel-control-prev" type="button" data-bs-target="#RelativeCarousel"
                            data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Previous</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#RelativeCarousel"
                            data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Fallback message when data is loading -->
    <div v-else class="loading-message">
        <p>Loading book details...</p>
    </div>
</template>


<script>
export default {
    name: 'BookDetails',
    data() {
        return {
            book: null, // Holds the fetched book details
            relativeBook: {},
        };
    },
    methods: {
        /**
         * Splits an array into chunks of a given size.
         * @param {Array} arr - The array to chunk.
         * @param {number} size - The size of each chunk.
         * @returns {Array[]} An array of chunked arrays.
         */
        chunkArray(arr, size) {
            const result = [];
            for (let i = 0; i < arr.length; i += size) {
                result.push(arr.slice(i, i + size));
            }
            return result;
        },

        /**
         * Fetches the book details based on the route parameter (ID).
         */
        async fetchBookDetails() {
            const bookId = this.$route.params.id;
            try {
                const response = await fetch(`/api/v1/books/${bookId}`);
                if (response.ok) {
                    const res = await response.json();
                    console.log("book details:", res);
                    this.book = res.data.book; // Assuming the API response has book details in `res.data.book`

                } else {
                    console.error('Error:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('Error fetching book details:', error.message);
            }
        },

        /**
         * Fetches the book details based on the route parameter (ID).
         */
        async fetchRelativeBook() {
            try {
                const response = await fetch(`http://localhost:8081/api/v1/books/search/${this.book.genre}`);
                if (response.ok) {
                    const res = await response.json();
                    console.log("Relative books:", res);
                    // Filter out the current book
                    const relativeBooks = res.data.books.filter(item => item._id !== this.book._id);

                    this.relativeBook = { data: { books: relativeBooks } };
                } else {
                    console.error('Error:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('Error fetching relative books:', error.message);
            }
        },

        /**
         * Converts a rating into a star display format.
         * @param {number} rating 
         * @returns {string} A string representing stars (e.g., ★★★★☆).
         */
        displayStars(rating) {
            const fullStars = Math.floor(rating); // Number of full stars
            const halfStar = rating % 1 >= 0.5 ? '★' : ''; // Check for a half-star
            const emptyStars = 5 - fullStars - (halfStar ? 1 : 0); // Remaining empty stars

            return '★'.repeat(fullStars) + halfStar + '☆'.repeat(emptyStars);
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
        this.fetchBookDetails(); // Fetch book details when the component is mounted
    },
    watch: {
        // Watch for route parameter changes
        '$route.params.id': {
            immediate: true, // Trigger the watcher immediately on mount
            handler() {
                this.fetchBookDetails();
                this.fetchRelativeBook();
            },
        },
        book(newBook) {
            if (newBook && newBook.genre) {
                this.fetchRelativeBook();
            }
        },
    },

};
</script>

<style scoped>
.book-details-container {
    padding: 2rem;
    background-color: none;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    margin: 2rem auto;
}

.book-image {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

h2 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
}

.author,
.rating,
.genre {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
}

.description {
    font-size: 1rem;
    line-height: 1.6;
}

.price {
    font-size: 1.5rem;
    font-weight: bold;
    color: #dc3545;
}

button {
    padding: 0.7rem 1.5rem;
    font-size: 1rem;
}

.card-title-relative {
    text-align: center;
    font-weight: bold;
    margin-top: 0.5rem;
    font-size: 0.9rem;
    max-width: 100%;
    white-space: nowrap;
    /* Prevent line breaks */
    overflow: hidden;
    /* Hide overflow text */
    text-overflow: ellipsis;
    /* Add ellipsis (...) */
}

.carousel-inner {
    background-color: none;
    /* Optional: Add a background color */
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
    filter: invert(1);
    /* Ensure visibility on light backgrounds */
}

.card-author,
.card-price-relative {
    display: block;
    text-align: center;
    width: 100%;
}

.card-body-relative {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>
