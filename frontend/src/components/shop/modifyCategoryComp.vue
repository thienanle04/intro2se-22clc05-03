<template>
    <div class="card">
        <div class="card-header mb-3 d-flex justify-content-between align-items-center">
            <h3>Modify And Delete Genre</h3>
            <RouterLink to="/shop/addBook" class="btn btn-primary">
                Add
            </RouterLink>
        </div>
        <div class="row d-flex align-items-center mb-3">
            <div class="col-5 text-end">
                <span>Genre</span>
            </div>
            <div class="col-7">
                <input type="text" class="form-control" v-model="name" placeholder="Enter genre name"
                    aria-label="Genre Name">
            </div>
        </div>

        <div v-if="genres.length > 0">
            <ul class="list-group mb-3">
                <li class="list-group-item" v-for="genre in paginatedGenres" :key="genre._id">
                    <div class="d-flex align-items-top">
                        <div>
                            <strong>{{ genre.name }}</strong>
                        </div>
                        <button class="btn btn-sm btn-info ms-auto mt-auto mb-auto" @click="selectGenre(genre)"
                            v-if="!selectedGenre || selectedGenre._id !== genre._id">
                            Edit
                        </button>
                    </div>
                    <div v-if="selectedGenre && selectedGenre._id === genre._id">
                        <div class="alert alert-info d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <strong>Editing:</strong> {{ selectedGenre._id }}
                            </div>
                            <button type="button" class="btn btn-danger btn-sm" @click="deleteGenre">Delete Selected
                                Genre</button>
                        </div>

                        <div class="card shadow-sm">
                            <div class="card-body">
                                <form>
                                    <!-- Name Input -->
                                    <div class="mb-3">
                                        <label for="genreName" class="form-label">Name</label>
                                        <input type="text" id="genreName" class="form-control"
                                            v-model="modifiedGenre.name" placeholder="Enter genre name">
                                    </div>

                                    <!-- Action Buttons -->
                                    <div class="d-flex justify-content-between">
                                        <button type="button" class="btn btn-success" @click="saveChanges">Save
                                            Changes</button>
                                        <button type="button" class="btn btn-secondary"
                                            @click="selectedGenre = null">Cancel</button>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>
                </li>
            </ul>
            <nav>
                <ul class="pagination justify-content-center">
                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                        <button class="page-link" @click="changePage(currentPage - 1)">Previous</button>
                    </li>
                    <li class="page-item" v-for="page in totalPages" :key="page"
                        :class="{ active: currentPage === page }">
                        <button class="page-link" @click="changePage(page)">{{ page }}</button>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                        <button class="page-link" @click="changePage(currentPage + 1)">Next</button>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</template>
<style>
.book-image {
    width: 100px;
    height: 100%;
    object-fit: contain;
    border-radius: 5px;
}
</style>

<script>
export default {
    name: "modifyCategoryComponent",
    data() {
        return {
            selectedGenre: null, // Book selected for modification
            modifiedGenre: {}, // Temporary copy of the selected book for editing
            currentPage: 1, // Current page
            itemsPerPage: 5,
            genre: '',
            genres: []
        };
    },
    watch: {
        genre() {
            this.searchGenres();
        }
    },
    async created() {
        this.genres = await this.getAllGenres();
    },
    computed: {
        totalPages() {
            return Math.ceil(this.genres.length / this.itemsPerPage);
        },
        paginatedGenres() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.genres.slice(start, end);
        }
    },
    methods: {
        async getAllGenres() {
            try {
                const response = await fetch(`http://localhost:8081/api/v1/genres`); // Perform GET request
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json(); // Parse JSON response
                return data.data.genres; // Return the books array
            } catch (error) {
                console.error("Failed to fetch genres:", error.message);
                return []; // Return an empty array in case of an error
            }
        },
        async searchGenres() {
            if (!this.genre) {
                this.genres = await this.getAllGenres();
                return;
            }

            const allGenres = await this.getAllGenres(); // Use the `getAllBooks` method

            this.genres = allGenres.filter(genre => {
                const matchesName = this.name ? genre.name.includes(this.name) : true;
                return matchesName;
            });
        },

        selectGenre(genre) {
            this.selectedGenre = genre;
            this.modifiedGenre = { ...genre }; // Make a shallow copy for editing
        },

        saveChanges() {
            if (!this.selectedGenre) {
                alert("No book selected for modification.");
                return;
            }
            console.log(this.selectedGenre);
            const updatedGenre = {
                name: this.modifiedGenre.name,
                isHidden: this.selectedGenre.isHidden
            };

            this.updateGenre(updatedGenre);
        },
        async deleteGenre() {
            if (!this.selectedGenre) {
                alert("Please select a genre to delete.");
                return;
            }
            // Phát sự kiện 'delete-book' cùng với ISBN và Title sách
            try {
                // Make a DELETE request to the API to delete the book
                const response = await fetch(`http://localhost:8081/api/genres/${this.selectedGenre._id}`, {
                    method: 'DELETE', // Specify the method as DELETE
                    headers: {
                        'Content-Type': 'application/json',
                        // Add any additional headers you need, such as authorization token
                        // 'Authorization': `Bearer ${this.getAuthToken()}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to delete genre: ${response.statusText}`);
                }

                alert(`Book "${this.selectedGenre.name}" has been deleted.`);

                // Optionally, remove the book from the UI list after deletion
                this.genres = this.genres.filter(genre => genre._id !== this.selectedGenre._id);
                this.selectedGenre = null; // Reset selected book

            } catch (error) {
                console.error('Error deleting genre:', error);
                alert('Failed to delete gerne. Please try again.');
                return;
            }
            alert(`Book "${this.selectedGenre.name}" has been deleted.`);
        },
        async updateGenre(updatedGenre) {

            try {
                const formData = new FormData();

                // Thêm các thuộc tính từ `updatedGenre` vào formData
                formData.append('name', updatedGenre.name);
                formData.append('isHidden', updatedGenre.isHidden);
                const response = await fetch(`http://localhost:8081/api/genres/${this.selectedGenre._id}`, {
                    method: 'PUT',
                    headers: {
                        // 'Authorization': `Bearer ${this.getAuthToken()}`,
                    },
                    body: formData, // Send the updated book data in the request body
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Genre updated successfully:', data);
                    alert(`Genre "${updatedGenre._id}" "${updatedGenre.name}"has been updated.`); // Notify user on success

                    // Clear fields after update
                    this.selectedGenre = null;
                    this.modifiedGenre = {};
                    this.searchGenres(); // Refresh the list of books
                } else {
                    console.error('Failed to update genre:', response.statusText);
                    alert('Failed to update the genre. Please try again.');
                }
            } catch (error) {
                console.error('Error updating genre:', error);
                alert('An error occurred while updating the genre.');
            }
        },

        // Method to retrieve the auth token (example)
        getAuthToken() {
            // This should retrieve the token from your app's state or storage
            return this.$store.getters.getAuthToken || ''; // Replace with actual method to get the token
        },
        changePage(page) {
            if (page < 1 || page > this.totalPages) return;
            this.currentPage = page;
        },
    }
};
</script>