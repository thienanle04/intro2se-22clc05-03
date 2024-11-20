<script setup>
import { RouterLink, RouterView } from 'vue-router'
import addComponent from "./components/addComponent.vue";
import deleteComponent from "./components/deleteComponent.vue";
import modifyComponent from "./components/modifyComponent.vue";
</script>

<template>
    <div class="btn-group" role="group">
        <button type = button class="btn btn-primary mb-3" @click="currentComponent = 'addBook'">Add Book</button>
        <button type = button class="btn btn-primary mb-3" @click="currentComponent = 'modifyBook'">Modify Book</button>
        <button type = button class="btn btn-primary mb-3" @click="currentComponent = 'deleteBook'">Delete Book</button>
    </div>
    
    <div>
        <addComponent v-show="currentComponent === 'addBook'" @addBook="addBook" />
        <modifyComponent v-show="currentComponent === 'modifyBook'" @modifyBook="modifyBook" />
        <deleteComponent v-show="currentComponent === 'deleteBook'" @deleteBook="deleteBook" />
    </div>
</template>

<script>
export default {
    data() {
        return {
            currentComponent: "addBook", // Component hiện tại
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
};
</script>
