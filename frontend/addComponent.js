
export const addComponent = {
    data() {
        return {
            book: {
                title: "",
                author: "",
                genre: "",
                price: 0,
                available: false,
                image: "", // URL for the book's image
                stock: 0,
                description: "",
                SBN: "",
                rating: 4.4,
                __v: 0
            },
        };
    },
    methods: {
        createNewBook() {
            return {
                title: this.book.title || "Null", // Replace with dynamic value
                image: this.book.image || "Null", // Replace with dynamic value
                author: this.book.author || "Null", // Replace with dynamic value
                price: this.book.price || 14.99, // Replace with dynamic value
                stock: this.book.stock || 0, // Replace with dynamic value
                genre: this.book.genre || "Null", // Replace with dynamic value
                description: this.book.description || "Null", // Replace with dynamic value
                SBN: this.book.SBN || "Null", // Replace with dynamic value
                rating: this.book.rating || 0, // Replace with dynamic value
                __v: 0 // Versioning, optional
            };
        },
        async submit() {
            try {
                const token = this.getAuthToken(); // Retrieve the authentication token
                const bookData = this.createNewBook(); // Use the book object directly
        
                const response = await fetch('/api/v1/books', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // Uncomment if using token authentication
                        // 'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(bookData), // Send the book data as JSON
                });
        
                if (!response.ok) {
                    throw new Error(`Failed to add book: ${response.statusText}`);
                }
        
                const data = await response.json();
                alert(`Book "${data.title}" has been successfully added.`);
                this.clearForm();
            } catch (error) {
                console.error('Error adding book:', error);
                alert('Failed to add book. Please try again.');
            }
        },
        clearForm() {
            this.book = {
                title: '',
                author: '',
                genre: '',
                price: null,
                available: false,
                image: '',
                stock: 0,
                description: '',
                SBN: '',
                rating: 0,
                __v: 0
            };
        },

        getAuthToken() {
            // Retrieve the token from storage or app state
            return localStorage.getItem('authToken') || ''; // Replace with actual token retrieval logic
        },
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
            <input type="text" class="form-control" v-model="book.image" placeholder="Image URL" aria-label="Image URL">
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
