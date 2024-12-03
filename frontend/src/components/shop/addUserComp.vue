<template>
    <div class="card">
        <div class="card-header mb-3">
            <h3>Add New User</h3>
        </div>

        <div class="row d-flex align-items-center mb-3">
            <div class="col-5 text-end">
                <span>UserName</span>
            </div>
            <div class="col-7">
                <input type="text" class="form-control" v-model="user.username" placeholder="UserName"
                    aria-label="UserName" required>
            </div>
        </div>

        <div class="row d-flex align-items-center mb-3">
            <div class="col-5 text-end">
                <span>Password</span>
            </div>
            <div class="col-7">
                <input type="text" class="form-control" v-model="user.password" placeholder="Password"
                    aria-label="Password" required>
            </div>
        </div>

        <div class="row d-flex align-items-center mb-3">
            <div class="col-5 text-end">
                <span>Role</span>
            </div>
            <div class="col-7">
                <select id="userRole" class="form-control" v-model="user.role">
                    <option value="user" selected>User</option>
                    <option value="admin">Admin</option>
                </select>
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
                <span>Name</span>
            </div>
            <div class="col-7">
                <input type="text" class="form-control" v-model="user.name" placeholder="Name" aria-label="Name">
            </div>
        </div>

        <div class="row d-flex align-items-center mb-3">
            <div class="col-5 text-end">
                <span>Phone</span>
            </div>
            <div class="col-7">
                <input type="text" class="form-control" v-model="user.phone" placeholder="Phone" aria-label="Phone">
            </div>
        </div>

        <div class="row d-flex align-items-center mb-3">
            <div class="col-5 text-end">
                <span>Address</span>
            </div>
            <div class="col-7">
                <input type="text" class="form-control" v-model="user.address" placeholder="Address"
                    aria-label="Address">
            </div>
        </div>

        <div class="row d-flex align-items-center mb-3">
            <div class="col-5 text-end">
                <span>Image URL</span>
            </div>
            <div class="col-7">
                <input type="file" id="userImage" class="form-control" @change="handleFileUpload" accept="image/*">
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
    name: 'addUserComponent',
    data() {
        return {
            user: {
                name: "",
                email: "",
                username: "",
                password: "",
                role: "",
                phone: "",
                address: "",
                image: "", // file
            },
        };
    },
    methods: {
        handleFileUpload(event) {
            const file = event.target.files[0]; // Get the first file from the input
            if (file) {
                const reader = new FileReader();

                // Read the file as a Data URL to preview the image or send it to the server
                reader.onload = () => {
                    this.user.image = reader.result; // Store the base64 string or file URL
                };

                reader.readAsDataURL(file); // Start reading the file
            }
        },
        createNewUser() {
            return {
                name: this.user.name || "Null", // Replace with dynamic value
                address: this.user.address || "Null", // Replace with dynamic value
                image: this.user.image || "Null", // Replace with dynamic value
            };
        },
        async submit() {
            if (!this.user.username) {
                alert('Please fill in the username field.');
                return;
            }
            if (!this.user.password) {
                alert('Please fill in the password field.');
                return;
            }
            if (!this.user.email) {
                alert('Please fill in the email field.');
                return;
            }
            if (!this.user.role) {
                alert('Please fill in the role field.');
                return;
            }
            try {
                // Create a FormData object
                const formData = new FormData();
                formData.append('name', this.user.name || 'Null');
                formData.append('email', this.user.email || 'Null');
                formData.append('username', this.user.username);
                formData.append('password', this.user.password);
                formData.append('role', this.user.role);
                formData.append('phone', this.user.phone || 'Null');
                formData.append('address', this.user.address || 'Null');

                // Append the image file if it exists
                if (this.user.image) {
                    formData.append('image', this.user.image);
                }

                for (let [key, value] of formData.entries()) {
                    console.log(key, value);
                }
                const response = await fetch('/api/v1/users/create', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.getAuthToken()}`, // Authorization header
                    },
                    body: formData, // Pass FormData object as the body
                });

                if (!response.ok) {
                    throw new Error(`Failed to add user: ${response.statusText}`);
                }

                const data = await response.json();
                alert(`User "${this.user.username}" has been successfully added.`);
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
                role: ""
            };
        },

        getAuthToken() {
            // Retrieve the token from storage or app state
            return this.$store.getters.getAuthToken || ''; // Replace with actual token retrieval logic
        },
    },
};
</script>
