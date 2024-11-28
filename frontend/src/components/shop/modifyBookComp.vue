<template>
    <div class="card">
        <div class="card-header mb-3">
            <h3>Modify And Delete Book</h3>
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
                    <div>
                        <strong>{{ book.title }}</strong> - {{ book.author }}
                        <br>
                        <small>ID: {{ book._id }}</small>
                        <button class="btn btn-sm btn-info float-end" @click="selectBook(book)">Edit</button>
                    </div>
                </li>
            </ul>
        </div>
        <div v-if="selectedBook">
            <div class="alert alert-info d-flex justify-content-between align-items-center mb-4">
                <div>
                    <strong>Editing:</strong> {{ selectedBook.title }} by {{ selectedBook.author }}
                </div>
                <button type="button" class="btn btn-danger btn-sm" @click="deleteBook">Delete Selected Book</button>
            </div>

            <div class="card shadow-sm">
                <div class="card-body">
                    <form>
                        <!-- Title Input -->
                        <div class="mb-3">
                            <label for="bookTitle" class="form-label">Title</label>
                            <input type="text" id="bookTitle" class="form-control" v-model="modifiedBook.title"
                                placeholder="Enter book title">
                        </div>

                        <!-- Author Input -->
                        <div class="mb-3">
                            <label for="bookAuthor" class="form-label">Author</label>
                            <input type="text" id="bookAuthor" class="form-control" v-model="modifiedBook.author"
                                placeholder="Enter author's name">
                        </div>

                        <!-- Year Input -->
                        <div class="mb-3">
                            <label for="bookYear" class="form-label">Year</label>
                            <input type="number" id="bookYear" class="form-control" v-model="modifiedBook.year"
                                placeholder="Enter publication year" min="0">
                        </div>

                        <!-- Action Buttons -->
                        <div class="d-flex justify-content-between">
                            <button type="button" class="btn btn-success" @click="saveChanges">Save Changes</button>
                            <button type="button" class="btn btn-secondary" @click="selectedBook = null">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <div v-else>
            <p class="text-muted">Please select a book to modify.</p>
        </div>

    </div>
</template>

<script>
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
                year: this.modifiedBook.year,
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
                        // Add any additional headers you need, such as authorization token
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
                        // 'Authorization': `Bearer ${token}`, // Bearer token for authentication
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