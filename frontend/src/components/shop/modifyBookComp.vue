<template>
    <div class="card">
        <div class="card-header mb-3 d-flex justify-content-between align-items-center">
            <h3>Modify And Delete Book</h3>
            <RouterLink to="/shop/add" class="btn btn-danger">
                Add
            </RouterLink>
        </div>
        <div class="row d-flex align-items-center mb-3">
            <div class="col-5 text-end">
                <span>ISBN</span>
            </div>
            <div class="col-7">
                <input type="text" class="form-control" v-model="isbn" placeholder="Enter ISBN" aria-label="ISBN">
            </div>
        </div>
        <div class="row d-flex align-items-center mb-3">
            <div class="col-5 text-end">
                <span>Book Title</span>
            </div>
            <div class="col-7">
                <input type="text" class="form-control" v-model="bookTitle" placeholder="Enter book title"
                    aria-label="Book Title">
            </div>
        </div>
        <div v-if="booksToModify.length > 0">
            <ul class="list-group mb-3">
                <li class="list-group-item" v-for="book in booksToModify" :key="book._id">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{{ book.title }}</strong> - {{ book.author }}
                            <br>
                            <small>ISBN: {{ book.SBN }}</small>
                            <br>
                            <small>Stock: {{ book.stock }}</small>
                        </div>
                        <img :src="book.image" alt="Book Image" class="rounded book-image">
                    </div>
                    <button class="btn btn-sm btn-info ms-auto" @click="selectBook(book)"
                        v-if="!selectedBook || selectedBook._id !== book._id">
                        Edit
                    </button>
                    <div v-if="selectedBook && selectedBook._id === book._id">
                        <div class="alert alert-info d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <strong>Editing:</strong> {{ selectedBook.title }} by {{ selectedBook.author }}
                            </div>
                            <button type="button" class="btn btn-danger btn-sm" @click="deleteBook">Delete Selected
                                Book</button>
                        </div>

                        <div class="card shadow-sm">
                            <div class="card-body">
                                <form>
                                    <!-- Title Input -->
                                    <div class="mb-3">
                                        <label for="bookTitle" class="form-label">Title</label>
                                        <input type="text" id="bookTitle" class="form-control"
                                            v-model="modifiedBook.title" placeholder="Enter book title">
                                    </div>

                                    <!-- Author Input -->
                                    <div class="mb-3">
                                        <label for="bookAuthor" class="form-label">Author</label>
                                        <input type="text" id="bookAuthor" class="form-control"
                                            v-model="modifiedBook.author" placeholder="Enter author's name">
                                    </div>

                                    <!-- Stock Input -->
                                    <div class="mb-3">
                                        <label for="bookStock" class="form-label">Stock</label>
                                        <input type="number" id="bookStock" class="form-control"
                                            v-model="modifiedBook.stock" placeholder="Enter stock quantity" min="0">
                                    </div>

                                    <!-- Genre Input -->
                                    <div class="mb-3">
                                        <label for="bookGenre" class="form-label">Genre</label>
                                        <input type="text" id="bookGenre" class="form-control"
                                            v-model="modifiedBook.genre" placeholder="Enter genre">
                                    </div>

                                    <!-- Image URL Input -->
                                    <div class="mb-3">
                                        <label for="bookImage" class="form-label">Image URL</label>
                                        <input type="url" id="bookImage" class="form-control"
                                            v-model="modifiedBook.image" placeholder="Enter image URL">
                                    </div>

                                    <!-- Description Input -->
                                    <div class="mb-3">
                                        <label for="bookDescription" class="form-label">Description</label>
                                        <textarea id="bookDescription" class="form-control" rows="3"
                                            v-model="modifiedBook.description"
                                            placeholder="Enter book description"></textarea>
                                    </div>

                                    <!-- Price Input -->
                                    <div class="mb-3">
                                        <label for="bookPrice" class="form-label">Price</label>
                                        <input type="number" id="bookPrice" class="form-control"
                                            v-model="modifiedBook.price" placeholder="Enter price" min="0" step="0.01">
                                    </div>

                                    <!-- Rating Input -->
                                    <div class="mb-3">
                                        <label for="bookRating" class="form-label">Rating</label>
                                        <input type="number" id="bookRating" class="form-control"
                                            v-model="modifiedBook.rating" placeholder="Enter rating (1-5)" min="1"
                                            max="5" step="0.1">
                                    </div>

                                    <!-- ISBN Input -->
                                    <div class="mb-3">
                                        <label for="bookISBN" class="form-label">ISBN</label>
                                        <input type="text" id="bookISBN" class="form-control"
                                            v-model="modifiedBook.SBN" placeholder="Enter ISBN">
                                    </div>

                                    <!-- Action Buttons -->
                                    <div class="d-flex justify-content-between">
                                        <button type="button" class="btn btn-success" @click="saveChanges">Save
                                            Changes</button>
                                        <button type="button" class="btn btn-secondary"
                                            @click="selectedBook = null">Cancel</button>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>
                </li>
            </ul>
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
import axios from '../../axios';
export default {
    name: "modifyComponent",
    data() {
        return {
            isbn: '', // ISBN to search
            bookTitle: '', // Title to search
            booksToModify: [], // List of books matching the search
            selectedBook: null, // Book selected for modification
            modifiedBook: {} // Temporary copy of the selected book for editing
        };
    },
    watch: {
        isbn() {
            this.searchBooks();
        },
        bookTitle() {
            this.searchBooks();
        }
    },
    async created() {
        this.booksToModify = await this.getAllBooks();
        console.log('book', this.booksToModify);
    },
    methods: {
        async getAllBooks() {
            try {
                const response = await fetch('http://localhost:8081/api/v1/books'); // Perform GET request
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json(); // Parse JSON response
                console.log("All books:", data.data.books);
                return data.data.books; // Return the books array
            } catch (error) {
                console.error("Failed to fetch books:", error.message);
                return []; // Return an empty array in case of an error
            }
        },

        async searchBooks() {
            if (!this.isbn && !this.bookTitle) {
                this.booksToModify = await this.getAllBooks();
                return;
            }

            const allBooks = await this.getAllBooks(); // Use the `getAllBooks` method

            this.booksToModify = allBooks.filter(book => {
                const matchesIsbn = this.isbn ? book._id.includes(this.isbn) : true;
                const matchesTitle = this.bookTitle
                    ? book.title.toLowerCase().includes(this.bookTitle.toLowerCase())
                    : true;
                return matchesIsbn && matchesTitle;
            });
        },

        selectBook(book) {
            this.selectedBook = book;
            this.modifiedBook = { ...book }; // Make a shallow copy for editing
        },

        saveChanges() {
            if (!this.selectedBook) {
                alert("No book selected for modification.");
                return;
            }

            const updatedBook = {
                title: this.modifiedBook.title,
                author: this.modifiedBook.author,
                stock: this.modifiedBook.stock,
                genre: this.modifiedBook.genre,
                image: this.modifiedBook.image,
                description: this.modifiedBook.description,
                price: this.price,
                rating: this.modifiedBook.rating,
                SBN: this.modifiedBook.SBN
            };

            const token = this.getAuthToken(); // Replace with actual token retrieval logic
            this.updateBook(updatedBook);
        },
        async deleteBook() {
            if (!this.selectedBook) {
                alert("Vui lòng chọn một cuốn sách để xóa!");
                return;
            }
            // Phát sự kiện 'delete-book' cùng với ISBN và Title sách
            try {
                // Make a DELETE request to the API to delete the book
                const response = await fetch(`/api/v1/books/${this.selectedBook._id}/delete`, {
                    method: 'DELETE', // Specify the method as DELETE
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to delete book: ${response.statusText}`);
                }

                const data = await response.json();

                alert(`Book "${this.selectedBook.Title}" has been deleted.`);

                // Optionally, remove the book from the UI list after deletion
                this.booksToModify = this.booksToModify.filter(book => book._id !== this.selectedBook._id);
                this.selectedBook = null; // Reset selected book

            } catch (error) {
                console.error('Error deleting book:', error);
                alert('Failed to delete book. Please try again.');
            }
            alert(`Book "${this.selectedBook.title}" has been deleted.`);
        },
        async updateBook(updatedBook, token) {
            try {
                const response = await fetch(`/api/v1/books/${this.selectedBook._id}/update`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    },
                    body: JSON.stringify(updatedBook), // Send the updated book data in the request body
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Book updated successfully:', data);
                    alert(`Book "${updatedBook.title}" has been updated.`); // Notify user on success

                    // Clear fields after update
                    this.selectedBook = null;
                    this.modifiedBook = {};
                    this.searchBooks(); // Refresh the list of books
                } else {
                    console.error('Failed to update book:', response.statusText);
                    alert('Failed to update the book. Please try again.');
                }
            } catch (error) {
                console.error('Error updating book:', error);
                alert('An error occurred while updating the book.');
            }
        },

        // Method to retrieve the auth token (example)
        getAuthToken() {
            // This should retrieve the token from your app's state or storage
            return localStorage.getItem('authToken') || ''; // Replace with actual method to get the token
        }
    }
};
</script>