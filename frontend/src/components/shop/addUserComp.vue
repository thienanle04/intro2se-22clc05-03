<template>
    <div class="card">
        <div class="card-header mb-3">
            <h3>Add New User</h3>
        </div>
        <div class="row d-flex align-items-center mb-3">
            <div class="col-5 text-end">
                <span>Name</span>
            </div>
            <div class="col-7">
                <input type="text" class="form-control" v-model="user.name" placeholder="Name" aria-label="Name">
            </div>
        </div>
        <div class="row d-flex align-items-center mb-3">
            <div class="col-5 text-end">
                <span>Email</span>
            </div>
            <div class="col-7">
                <input type="text" class="form-control" v-model="user.email" placeholder="Email" aria-label="Email">
            </div>
        </div>

        <div class="row d-flex align-items-center mb-3">
            <div class="col-5 text-end">
                <span>UserName</span>
            </div>
            <div class="col-7">
                <input type="text" class="form-control" v-model="user.username" placeholder="UserName" aria-label="UserName" required>
            </div>
        </div>

        <div class="row d-flex align-items-center mb-3">
            <div class="col-5 text-end">
                <span>Password</span>
            </div>
            <div class="col-7">
                <input type="text" class="form-control" v-model="user.password" placeholder="Password" aria-label="Password" required>
            </div>
        </div>

        <div class="row d-flex align-items-center mb-3">
            <div class="col-5 text-end">
                <span>Phone</span>
            </div>
            <div class="col-7">
                <input type="text" class="form-control" v-model="user.password" placeholder="Password" aria-label="Password">
            </div>
        </div>

        <div class="row d-flex align-items-center mb-3">
            <div class="col-5 text-end">
                <span>Address</span>
            </div>
            <div class="col-7">
                <input type="text" class="form-control" v-model="user.address" placeholder="Address" aria-label="Address">
            </div>
        </div>

        <div class="row d-flex align-items-center mb-3">
            <div class="col-5 text-end">
                <span>Image URL</span>
            </div>
            <div class="col-7">
                <input type="text" class="form-control" v-model="user.image" placeholder="Image URL" aria-label="Image URL">
            </div>
        </div>

        <div class="row d-flex align-items-center mb-3">
            <div class="offset-5">
                <button type="button" class="btn btn-primary" @click="submit">Submit</button>
            </div>
        </div>

    </div>
</template>

<script>
export default {
    name: 'addComponent',
    data() {
        return {
            user: {
                name: "",
                email: "",
                username: "",
                password: "",
                phone: "",
                address: "",
                image: "", // URL for the book's image
            },
        };
    },
    methods: {
        createNewUser() {
            return {
                name: this.user.name || "Null", // Replace with dynamic value
                email: this.user.email || "Null", // Replace with dynamic value
                username: this.user.username || "Null", // Replace with dynamic value
                password: this.user.password || "Null", // Replace with dynamic value
                address: this.user.address || "Null", // Replace with dynamic value
                image: this.user.image || "Null", // Replace with dynamic value
            };
        },
        async submit() {
            try {
                const token = this.getAuthToken(); // Retrieve the authentication token
                const userData = this.createNewUser(); // Use the book object directly

                const response = await fetch('/api/v1/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(userData), // Send the book data as JSON
                });

                if (!response.ok) {
                    throw new Error(`Failed to add user: ${response.statusText}`);
                }

                const data = await response.json();
                alert(`User "${user.username}" has been successfully added.`);
                this.clearForm();
            } catch (error) {
                console.error('Error adding user:', error);
                alert('Failed to add user. Please try again.');
            }
        },
        clearForm() {
            this.user = {
                name: "",
                email: "",
                username: "",
                password: "",
                phone: "",
                address: "",
                image: "",
            };
        },

        getAuthToken() {
            // Retrieve the token from storage or app state
            return localStorage.getItem('authToken') || ''; // Replace with actual token retrieval logic
        },
    },
};
</script>
