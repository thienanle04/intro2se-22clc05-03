export const deleteComponent = {
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
        searchBooks() {
            if (!this.isbn && !this.bookTitle) {
                this.booksToDelete = []; // Nếu không có ISBN và tên sách, không hiển thị sách
                return;
            }

            const allBooks = this.getAllBooks(); // Lấy tất cả sách (API hoặc dữ liệu giả lập)

            // Tìm tất cả sách có ISBN và tên trùng với dữ liệu nhập vào
            this.booksToDelete = allBooks.filter(book => {
                const matchesIsbn = this.isbn ? book.ISBN.includes(this.isbn) : true;
                const matchesTitle = this.bookTitle ? book.Title.toLowerCase().includes(this.bookTitle.toLowerCase()) : true;
                return matchesIsbn && matchesTitle;
            });
        },

        // Xoá sách đã chọn
        deleteBook() {
            if (!this.selectedBook) {
                alert("Vui lòng chọn một cuốn sách để xóa!");
                return;
            }
            // Phát sự kiện 'delete-book' cùng với ISBN và Title sách
            this.$emit('delete-book', { isbn: this.selectedBook.ISBN, title: this.selectedBook.Title });
            alert(`Book "${this.selectedBook.Title}" has been deleted.`);
        },

        // Hàm giả lập lấy tất cả sách (thực tế sẽ thay thế bằng API thực tế)
        getAllBooks() {
            // Dữ liệu giả lập, thay thế bằng API thực tế
            return [
                { ISBN: '12345', Title: 'Learn Vue', AuthorName: 'John Doe', Year: 2023 },
                { ISBN: '67890', Title: 'Learn Vue', AuthorName: 'Jane Doe', Year: 2022 },
                { ISBN: '11223', Title: 'JavaScript Basics', AuthorName: 'Alice Smith', Year: 2020 },
                { ISBN: '44556', Title: 'Vue.js for Beginners', AuthorName: 'Charlie Brown', Year: 2021 },
            ];
        }
    },
    template: `
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
            <li class="list-group-item" v-for="book in booksToDelete" :key="book.ISBN">
                <div>
                    <strong>{{ book.Title }}</strong> - {{ book.AuthorName }} ({{ book.Year }})
                    <br>
                    <small>ISBN: {{ book.ISBN }}</small>
                    <button class="btn btn-sm btn-info float-end" @click="selectedBook = book">Select</button>
                </div>
            </li>
        </ul>
    </div>
    <div v-if="selectedBook">
        <div class="alert alert-info">
            <strong>Selected:</strong> {{ selectedBook.Title }} by {{ selectedBook.AuthorName }}
        </div>
        <button type="button" class="btn btn-danger" @click="deleteBook">Delete Selected Book</button>
    </div>
    <div v-else>
        <p class="text-muted">Please select a book to delete.</p>
    </div>
</div>
`
};
