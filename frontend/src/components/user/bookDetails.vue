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

        <!-- Review Submission -->
        <div v-if="isAuthenticated" class="mt-4">
            <h5>Write a Review</h5>
            <textarea v-model="newReview.content" placeholder="Write your review..." class="form-control" rows="3"></textarea>
            <div class="rating mt-2">
            <label>Rating: </label>
            <input type="number" v-model="newReview.rating" min="1" max="5" class="form-control d-inline-block w-auto" />
            </div>
            <button @click="submitReview" class="btn btn-primary mt-3">Submit Review</button>
        </div>

        <!-- If not authenticated -->
        <div v-else class="mt-4">
            <p>You must be logged in to write a review.</p>
        </div>
        
        <!-- Reviews Section -->
        <div v-if="book && book.reviews && book.reviews.length" class="reviews-section mt-4">
            <!-- Reviews Header -->
            <h4 class="text-center">Reviews</h4>
            
            <!-- Reviews List with Pagination -->
            <div class="reviews-container" style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
                <div v-for="(review, index) in paginatedReviews" :key="index" class="review-item mb-4">
                    <div class="d-flex align-items-center">
                        <img :src="review.avatar" alt="User Avatar" class="rounded-circle" style="width: 40px; height: 40px; object-fit: cover;" />
                        <div class="ms-3">
                            <strong>{{ review.user }}</strong>
                            <p>{{ review.content }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pagination Controls -->
            <div class="pagination-container d-flex justify-content-center mt-4">
                <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="btn btn-light me-2">Previous</button>
                <span>Page {{ currentPage }} of {{ totalPages }}</span>
                <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="btn btn-light ms-2">Next</button>
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
import Swal from 'sweetalert2';

export default {
    name: 'BookDetails',
    data() {
        return {
            book: null, // Holds the fetched book details
            relativeBook: {},
            currentPage: 1, // Current page of reviews
            reviewsPerPage: 5, // Number of reviews per page
            newReview: {
                rating: null,
                content: '',
            },
        };
    },
    computed: {
        totalPages() {
            // Calculate total pages based on the number of reviews
            return Math.ceil(this.book.reviews.length / this.reviewsPerPage);
        },
        paginatedReviews() {
            // Slice the reviews array to get the reviews for the current page
            const start = (this.currentPage - 1) * this.reviewsPerPage;
            const end = start + this.reviewsPerPage;
            return this.book.reviews.slice(start, end);
        },
        isAuthenticated() {
        return this.$store.getters.isAuthenticated;
        },
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

          changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
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

        async submitReview() {
            if (!this.isAuthenticated) {
            Swal.fire({
                title: "Login Required",
                text: "You must be logged in to submit a review.",
                icon: "warning",
            });
            return;
            }
            const reviewData = {
                rating: this.newReview.rating,
                comment: this.newReview.content, 
            };


            try {
             const bookId = this.$route.params.id;
            const response = await fetch(`/api/v1/books/${bookId}/review`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.$store.getters.getAuthToken}`,
                },
                body: JSON.stringify(reviewData),
            });

            const data = await response.json();

            if (data.code === 1) {
                Swal.fire({
                title: "Review Submitted",
                text: data.message,
                icon: "success",
                });
                this.newReview.comment = '';  // Clear the comment input
                this.newReview.rating = 5;    // Reset the rating
                this.fetchBookDetails();     // Refresh book details to show the new review
            } else {
                Swal.fire({
                title: "Error",
                text: data.message || "Failed to submit your review. Please try again.",
                icon: "error",
                });
            }
            } catch (error) {
            Swal.fire({
                title: "Error",
                text: `An error occurred while submitting your review: ${error.message}`,
                icon: "error",
            });
            }
        },
        redirectToLogin() {
            this.$router.push('/login'); // Redirect to the login page
        },
         isUserLoggedIn() {
            // Check if the user is logged in by checking for a token or using Vuex state
            // Assuming the JWT token is stored in localStorage
            return !!localStorage.getItem('authToken'); // or use Vuex if needed
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
            // Ensure rating is a number and falls within the 0 to 5 range
            if (isNaN(rating) || rating < 0 || rating > 5) {
                return '☆☆☆☆☆'; // Or return a default star string like '☆☆☆☆☆'
            }

            const fullStars = Math.floor(rating); // Number of full stars
            const halfStar = rating % 1 >= 0.5 ? '★' : ''; // Check for a half-star
            const emptyStars = 5 - fullStars - (halfStar ? 1 : 0); // Remaining empty stars

            // Ensure no negative or NaN values are passed to repeat()
            return '★'.repeat(Math.max(0, fullStars)) + halfStar + '☆'.repeat(Math.max(0, emptyStars));
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
