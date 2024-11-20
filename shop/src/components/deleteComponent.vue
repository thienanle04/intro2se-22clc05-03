<template>
    <div class="card">
    <div class="card-header mb-3">
        <h3>Delete Book</h3>
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
    <div v-if="booksToDelete.length > 0">
        <h5 class="mt-3">Books found:</h5>
        <ul class="list-group mb-3">
            <li class="list-group-item" v-for="book in booksToDelete" :key="book._id">
                <div>
                <strong>{{ book.title }}</strong> - {{ book.author }} 
                <br>
                <small>ISBN: {{ book._id }}</small>
                <button class="btn btn-sm btn-info float-end" @click="selectedBook = book">Select</button>
                </div>
                </li>
                </ul>
                </div>
                <div v-if="selectedBook">
        <div class="alert alert-info">
            <strong>Selected:</strong> {{ selectedBook.title }} by {{ selectedBook.author }}
        </div>
        <button type="button" class="btn btn-danger" @click="deleteBook">Delete Selected Book</button>
    </div>
    <div v-else>
        <p class="text-muted">Please select a book to delete.</p>
    </div>
</div>
</template>

<script>
export default {
    name: 'deleteComponent',
    data() {
        return {
            isbn: '',  // ISBN sách cần xoá
            bookTitle: '', // Tên sách cần xoá
            booksToDelete: [], // Danh sách sách có ISBN và tên trùng
            selectedBook: null // Sách đã chọn để xoá
        };
    },
    watch: {
        // Watchers để theo dõi sự thay đổi của ISBN và bookTitle và gọi searchBooks
        isbn() {
            this.searchBooks();
        },
        bookTitle() {
            this.searchBooks();
        }
    },
    methods: {
        // Hàm tìm sách có ISBN và Tên sách trùng
        async searchBooks() {
            if (!this.isbn && !this.bookTitle) {
                this.booksToDelete = [];
                return;
            }
            
            try {
                // Fetch books from API
                const res = await fetch('http://localhost:8081/api/v1/books');
                
                // Check if the response is valid
                if (!res.ok) {
                    throw new Error('Failed to fetch books');
                }
                
                // Parse the response JSON
                const data = await res.json();
                
                // Check if the books data exists and is an array
                const allBooks = Array.isArray(data?.data?.books) ? data.data.books : [];
                console.log(allBooks); // Check the data structure
                
                // If no books were returned or API returned invalid data
                if (allBooks.length === 0) {
                    alert('No books found matching the criteria');
                    return;
                }
                
                // Filter books based on ISBN and Title
                this.booksToDelete = allBooks.filter(book => {
                    const matchesIsbn = this.isbn ? book._id.includes(this.isbn) : true;
                    const matchesTitle = this.bookTitle ? book.title.toLowerCase().includes(this.bookTitle.toLowerCase()) : true;
                    return matchesIsbn && matchesTitle;
                });
            } catch (error) {
                console.error('Error searching books:', error);
                alert('An error occurred while searching for books. Please try again.');
            }
        },      
        // Xoá sách đã chọn
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
                        // 'Authorization': `Bearer ${token}`,
                    },
                });
                
                if (!response.ok) {
                    throw new Error(`Failed to delete book: ${response.statusText}`);
                }
                
                const data = await response.json();
                console.log(data); // Handle the response data (e.g., success message)
                
                alert(`Book "${this.selectedBook.Title}" has been deleted.`);
                
                // Optionally, remove the book from the UI list after deletion
                this.booksToDelete = this.booksToDelete.filter(book => book._id !== this.selectedBook._id);
                this.selectedBook = null; // Reset selected book
                
            } catch (error) {
                console.error('Error deleting book:', error);
                alert('Failed to delete book. Please try again.');
            }
            alert(`Book "${this.selectedBook.title}" has been deleted.`);
        },
        
        // Hàm giả lập lấy tất cả sách (thực tế sẽ thay thế bằng API thực tế)
        async getAllBooks() {
            // Dữ liệu giả lập, thay thế bằng API thực tế
            const res = await fetch('http://localhost:8081/api/v1/books');
            const data = await res.json();
            console.log(data.data.books);
            return data.data.books;
        }
    },
};
</script>