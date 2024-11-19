import { addComponent } from "./addComponent.js";
import { deleteComponent } from "./deleteComponent.js";
import { modifyComponent } from "./modifyComponent.js";

export default {
    data() {
        return {
            isAddComponent: true,  // Hiển thị component thêm sách
            isDeleteComponent: false, // Hiển thị component xóa sách
            isModifyComponent: false,
            books: [], // Danh sách sách hiện có
        };
    },
    components: {
        addComponent,
        deleteComponent,
        modifyComponent
    },
    methods: {
        // Thêm sách vào danh sách
        addBook(data) {
            // this.books.push(data); // Thêm sách mới vào danh sách
            // console.log("Book added:", data);
        },
        // Xóa sách theo ISBN và Tên sách
        deleteBook({ isbn, title }) {
            // const index = this.books.findIndex(book => book.ISBN === isbn && book.Title.toLowerCase() === title.toLowerCase());
            // if (index !== -1) {
            //     this.books.splice(index, 1); // Xóa sách khỏi danh sách
            //     console.log(`Book with ISBN "${isbn}" and Title "${title}" has been deleted.`);
            // } else {
            //     console.log(`Book with ISBN "${isbn}" and Title "${title}" not found!`);
            // }
        },
        modifyBook(updatedBook) {
            // const index = this.books.findIndex(book => book.ISBN === updatedBook.ISBN);
            // if (index !== -1) {
            //     this.books[index] = { ...this.books[index], ...updatedBook };
            //     console.log("Book updated:", updatedBook);
            // } else {
            //     console.log(`Book with ISBN "${updatedBook.ISBN}" not found!`);
            // }
        }
    },
    template: `
<div>
    <button class="btn btn-primary mb-3" @click="isAddComponent = true; isDeleteComponent = false; isModifyComponent = false;">Add Book</button>
    <button class="btn btn-danger mb-3" @click="isAddComponent = false; isDeleteComponent = true; isModifyComponent = false;">Delete Book</button>
    <button class="btn btn-danger mb-3" @click="isAddComponent = false; isDeleteComponent = false; isModifyComponent = true;">Modify Book</button>

    <addComponent v-if="isAddComponent" @submit-book="addBook" />
    <deleteComponent v-if="isDeleteComponent" @delete-book="deleteBook" />
    <modifyComponent v-if="isModifyComponent" @modify-book="modifyBook" />
</div>
`
};
