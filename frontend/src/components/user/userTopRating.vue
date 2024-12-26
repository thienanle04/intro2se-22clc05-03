<template>
    <div class="row justify-content-center w-100">
        <div class="col-md-11">
            <div class="position-relative mb-3">
                <h4 class="text-center mb-0">Top Ratings</h4>
            </div>
            <div>
                <div id="topRatingCarousel" class="carousel carousel-dark slide" data-bs-ride="carousel">
                    <div class="carousel-inner d-flex align-items-center " style="height: 450px;">
                        <!-- Group items in sets of 4 -->
                        <div v-for="(chunk, chunkIndex) in chunkArray(topRating.data?.books || [], 4)" :key="chunkIndex"
                            class="carousel-item" :class="{ active: chunkIndex === 0 }">
                            <div class="d-flex justify-content-center">
                                <!-- Loop through the chunk of 4 items -->
                                <div v-for="(item, itemIndex) in chunk" :key="`${chunkIndex}-${itemIndex}`"
                                    class="card mx-4" style="width: 200px; cursor: pointer;">
                                    <img :src="item.image" :alt="item.title" class="card-img-top"  @click="goToBookDetails(item._id)"
                                        style="height: 250px; object-fit: fill;" />
                                    <div class="card-body d-flex flex-column justify-content-center align-items-center">
                                        <div class="card-title text-center"  @click="goToBookDetails(item._id)">
                                            {{ item.title }}
                                        </div>
                                        <div class="card-author text-center mb-2" style="font-size: 14px;">
                                            {{ item.author }}
                                        </div>
                                        <div class="card-rating text-center mb-2" style="font-size: 14px;">
                                            {{ item.rating }}⭐
                                        </div>
                                        <div class="card-price text-center text-danger">
                                            <button @click="this.$store.dispatch('addToCart', { book: item });" class="btn" role="button">
                                                <i class="bi bi-cart3 fs-4"></i>
                                            </button>
                                            {{ item.price }}$
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Carousel controls -->
                    <button class="carousel-control-prev w-auto" type="button" data-bs-target="#topRatingCarousel"
                        data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next w-auto" type="button" data-bs-target="#topRatingCarousel"
                        data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'userTopRating',
    inject: ['books'],
    data() {
        return {
            topRating: {} // Initialize as an object to hold data, not an array
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
         * Navigates to the Book Details page with the given ID.
         * @param {string} id - The ID of the book to view details.
         */
        goToBookDetails(id) {
            this.$router.push({ name: 'BookDetails', params: { id } });
        },
    },
    mounted() {
        this.topRating = { data: { books: this.books.sort((a, b) => b.rating - a.rating).slice(0, 20) } };
    }
};
</script>


<style scoped>
.card-title {
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
.card-price {
    display: block;
    text-align: center;
    width: 100%;
}

.card-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>
