<template>
    <div class="card">
        <div class="card-header mb-3">
            <h3>Modify Book</h3>
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
                <input type="text" class="form-control" v-model="bookTitle" placeholder="Enter book title" aria-label="Book Title">
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
            <div class="alert alert-info">
                <strong>Editing:</strong> {{ selectedBook.title }} by {{ selectedBook.author }}
            </div>
            <div class="mb-3">
                <label class="form-label">Title</label>
                <input type="text" class="form-control" v-model="modifiedBook.title">
            </div>
            <div class="mb-3">
                <label class="form-label">Author</label>
                <input type="text" class="form-control" v-model="modifiedBook.author">
            </div>
            <div class="mb-3">
                <label class="form-label">Year</label>
                <input type="number" class="form-control" v-model="modifiedBook.year">
            </div>
            <button type="button" class="btn btn-success" @click="saveChanges">Save Changes</button>
            <button type="button" class="btn btn-secondary" @click="selectedBook = null">Cancel</button>
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
    async created () {
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
                this.booksToModify = [];
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