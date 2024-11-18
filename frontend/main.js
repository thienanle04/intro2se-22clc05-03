import { addComponent } from "./addComponent.js";
import { deleteComponent } from "./deleteComponent.js";

export default {
    data() {
        return {
            isAddComponent: true,  // Hiển thị component thêm sách
            isDeleteComponent: false, // Hiển thị component xóa sách
            books: [], // Danh sách sách hiện có
        };
    },
    components: {
        addComponent,
        deleteComponent
    },
    methods: {
        // Thêm sách vào danh sách
        addBook(data) {
            this.books.push(data); // Thêm sách mới vào danh sách
            console.log("Book added:", data);
        },
        // Xóa sách theo ISBN và Tên sách
        deleteBook({ isbn, title }) {
            const index = this.books.findIndex(book => book.ISBN === isbn && book.Title.toLowerCase() === title.toLowerCase());
            if (index !== -1) {
                this.books.splice(index, 1); // Xóa sách khỏi danh sách
                console.log(`Book with ISBN "${isbn}" and Title "${title}" has been deleted.`);
            } else {
                console.log(`Book with ISBN "${isbn}" and Title "${title}" not found!`);
            }
        }
    },
    template: `
<div>
    <button class="btn btn-primary mb-3" @click="isAddComponent = true; isDeleteComponent = false;">Add Book</button>
    <button class="btn btn-danger mb-3" @click="isAddComponent = false; isDeleteComponent = true;">Delete Book</button>

    <addComponent v-if="isAddComponent" @submit-book="addBook" />
    <deleteComponent v-if="isDeleteComponent" @delete-book="deleteBook" />
</div>
`
};
