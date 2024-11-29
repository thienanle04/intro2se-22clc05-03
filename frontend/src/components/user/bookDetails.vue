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
                        <button class="btn btn-danger mt-3">
                            <i class="bi bi-cart3 fs-4"></i>
                            Add to Cart
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
        };
    },
    methods: {
        /**
         * Fetches the book details based on the route parameter (ID).
         */
        async fetchBookDetails() {
            const bookId = this.$route.params.id;
            try {
                const response = await fetch(`http://localhost:8081/api/v1/books/${bookId}`);
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
    },
    mounted() {
        this.fetchBookDetails(); // Fetch book details when the component is mounted
    }
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
</style>
