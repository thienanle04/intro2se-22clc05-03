export const addComponent = {
    data() {
        return {
            book: {
                title: '',
                author: '',
                genre: '',
                price: null,
                available: false,
                imageUrl: '', // Thuộc tính mới để lưu URL hình ảnh
            },
        };
    },
    methods: {
        submit(){
            this.$emit('submit-book', { ...this.book });
        }
    },
    template: `
<div class="card">
    <div class="card-header mb-3">  
        <h3>Add New Book</h3>
    </div>    
    <div class="row d-flex align-items-center mb-3">
        <div class="col-5 text-end">
            <span>Title</span>
        </div>
        <div class="col-7">
            <input type="text" class="form-control" v-model="book.title" placeholder="Title" aria-label="Title">
        </div>          
    </div>
    <div class="row d-flex align-items-center mb-3">
        <div class="col-5 text-end">
            <span>Author</span>
        </div>
        <div class="col-7">
            <input type="text" class="form-control" v-model="book.author" placeholder="Author" aria-label="Author">
        </div>          
    </div>
    <div class="row d-flex align-items-center mb-3">
        <div class="col-5 text-end">
            <span>Genre</span>
        </div>
        <div class="col-7">
            <input type="text" class="form-control" v-model="book.genre" placeholder="Genre" aria-label="Genre">
        </div>          
    </div>
    <div class="row d-flex align-items-center mb-3">
        <div class="col-5 text-end">
            <span>Price</span>
        </div>
        <div class="col-7">
            <input type="number" class="form-control" v-model.number="book.price" placeholder="Price" aria-label="Price">
        </div>          
    </div>
    <div class="row d-flex align-items-center mb-3">
        <div class="col-5 text-end">
            <span>Image URL</span>
        </div>
        <div class="col-7">
            <input type="text" class="form-control" v-model="book.imageUrl" placeholder="Image URL" aria-label="Image URL">
        </div>          
    </div>
    <div class="row d-flex align-items-center mb-3">
        <div class="offset-5">
            <div class="form-check">
                <input class="form-check-input" type="checkbox" v-model="book.available" id="checkBox">
                <label class="form-check-label" for="checkBox">
                    Available
                </label>
            </div>
        </div>          
    </div>
    <div class="row d-flex align-items-center mb-3">
        <div class="offset-5">
            <button type="button" class="btn btn-primary" @click="submit">Submit</button>
        </div>          
    </div>
</div>    
`
};