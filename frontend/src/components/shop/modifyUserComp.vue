<template>
    <div class="card">
        <div class="card-header mb-3 d-flex justify-content-between align-items-center">
            <h3>Modify And Delete User</h3>
            <RouterLink to="/shop/addUser" class="btn btn-primary">
                Add
            </RouterLink>
        </div>
        <div class="row d-flex align-items-center mb-3">
            <div class="col-5 text-end">
                <span>UserName</span>
            </div>
            <div class="col-7">
                <input type="text" class="form-control" v-model="username" placeholder="Enter Username"
                    aria-label="Username">
            </div>
        </div>
        <div class="row d-flex align-items-center mb-3">
            <div class="col-5 text-end">
                <span>Name</span>
            </div>
            <div class="col-7">
                <input type="text" class="form-control" v-model="name" placeholder="Enter User's Name"
                    aria-label="Name">
            </div>
        </div>

        <div v-if="paginatedUsers.length > 0">
            <ul class="list-group mb-3">
                <li class="list-group-item" v-for="user in paginatedUsers" :key="user._id">
                    <div class="d-flex align-items-top">
                        <img :src="user.image" alt="User Image" class="rounded user-image me-3">
                        <div>
                            <strong>{{ user.name }}</strong>
                            <br>
                            ID: {{ user._id }}
                            <br>
                            <small>username: {{ user.username }}</small>
                            <br>
                            <small>email: {{ user.email }}</small>
                            <br>
                            <small>role: {{ user.role }}</small>
                        </div>
                        <button class="btn btn-sm btn-info ms-auto mt-auto mb-auto" @click="selectUser(user)"
                            v-if="!selectedUser || selectedUser._id !== user._id">
                            Edit
                        </button>
                    </div>
                    <div v-if="selectedUser && selectedUser._id === user._id">
                        <div class="alert alert-info d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <strong>Editing:</strong> Username: {{ selectedUser.username }}
                            </div>
                            <button type="button" class="btn btn-danger btn-sm" @click="deleteUser">Delete Selected
                                User</button>
                        </div>

                        <div class="card shadow-sm">
                            <div class="card-body">
                                <form>
                                    <!-- Name Input -->
                                    <div class="mb-3">
                                        <label for="userName" class="form-label">Name</label>
                                        <input type="text" id="userName" class="form-control"
                                            v-model="modifiedUser.name" placeholder="Enter user's name">
                                    </div>

                                    <!-- Email Input -->
                                    <div class="mb-3">
                                        <label for="userEmail" class="form-label">Email</label>
                                        <input type="text" id="userEmail" class="form-control"
                                            v-model="modifiedUser.email" placeholder="Enter user's email">
                                    </div>

                                    <!-- Address Input -->
                                    <div class="mb-3">
                                        <label for="userAddress" class="form-label">Address</label>
                                        <input type="text" id="userAddress" class="form-control"
                                            v-model="modifiedUser.address" placeholder="Enter user's address">
                                    </div>

                                    <div class="mb-3">
                                        <label for="userRole" class="form-label">Role</label>
                                        <select id="userRole" class="form-control" v-model="modifiedUser.role">
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>

                                    <!-- Image Input -->
                                    <div class="mb-3">
                                        <label for="userImage" class="form-label">Upload Image</label>
                                        <input type="file" id="userImage" class="form-control"
                                            @change="handleFileUpload" accept="image/*">
                                    </div>

                                    <!-- Action Buttons -->
                                    <div class="d-flex justify-content-between">
                                        <button type="button" class="btn btn-success" @click="saveChanges">Save
                                            Changes</button>
                                        <button type="button" class="btn btn-secondary"
                                            @click="selectedUser = null">Cancel</button>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>
                </li>
                <nav>
                    <ul class="pagination justify-content-center">
                        <li class="page-item" :class="{ disabled: currentPage === 1 }">
                            <button class="page-link" @click="changePage(currentPage - 1)">Previous</button>
                        </li>
                        <li class="page-item" v-for="page in totalPages" :key="page"
                            :class="{ active: page === currentPage }">
                            <button class="page-link" @click="changePage(page)">{{ page }}</button>
                        </li>
                        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                            <button class="page-link" @click="changePage(currentPage + 1)">Next</button>
                        </li>
                    </ul>
                </nav>
            </ul>
        </div>
    </div>

</template>
<style>
.user-image {
    width: 100px;
    height: 100%;
    object-fit: contain;
    border-radius: 5px;
}
</style>

<script>
export default {
    name: "modifyUserComponent",
    data() {
        return {
            name: '',
            username: '',
            usersToModify: [],
            selectedUser: null,
            modifiedUser: {},
            currentPage: 1,
            itemsPerPage: 5,
        };
    },
    watch: {
        name() {
            this.searchUsers();
        },
        username() {
            this.searchUsers();
        }
    },
    async created() {
        this.usersToModify = await this.getAllUsers();
        console.log(this.usersToModify);
    },
    computed: {
        totalPages() {
            return Math.ceil(this.usersToModify.length / this.itemsPerPage);
        },
        paginatedUsers() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.usersToModify.slice(start, end);
        },
    },
    methods: {
        handleFileUpload(event) {
            const file = event.target.files[0]; // Get the first file from the input
            if (file) {
                const reader = new FileReader();

                // Read the file as a Data URL to preview the image or send it to the server
                reader.onload = () => {
                    this.modifiedUser.image = reader.result; // Store the base64 string or file URL
                };

                reader.readAsDataURL(file); // Start reading the file
            }
        },
        async getAllUsers() {
            try {
                const response = await fetch('/api/v1/users', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${this.getAuthToken()}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json(); // Parse JSON response
                return data.data; // Return the users array
            } catch (error) {
                console.error("Failed to fetch users:", error.message);
                return []; // Return an empty array in case of an error
            }
        },

        async searchUsers() {
            if (!this.username && !this.name) {
                this.usersToModify = await this.getAllUsers();
                return;
            }

            const allUsers = await this.getAllUsers(); // Use the `getAllBooks` method
            this.usersToModify = allUsers.filter(user => {
                const matchesUsername = this.username ? user.username.includes(this.username) : true;
                const matchesName = this.name
                    ? user.name && user.name.toLowerCase().includes(this.name.toLowerCase())
                    : true;

                return matchesName && matchesUsername;
            });
            this.currentPage = 1;
        },

        selectUser(user) {
            this.selectedUser = user;
            this.modifiedUser = { ...user }; // Make a shallow copy for editing
        },

        saveChanges() {
            if (!this.selectedUser) {
                alert("No user selected for modification.");
                return;
            }
            console.log('modifiedUser', this.modifiedUser);
            const updatedUser = {
                name: this.modifiedUser.name,
                email: this.modifiedUser.email,
                address: this.modifiedUser.address,
                role: this.modifiedUser.role,
                image: this.modifiedUser.image
            };

            this.updateUser(updatedUser);
        },

        async deleteUser() {
            if (!this.selectedUser) {
                alert("Please select a user to delete.");
                return;
            }
            try {
                // Make a DELETE request to the API to delete the user
                const response = await fetch(`/api/v1/users/${this.selectedUser._id}/delete`, {
                    method: 'DELETE', // Specify the method as DELETE
                    headers: {
                        'Content-Type': 'application/json',
                        // Add any additional headers you need, such as authorization token
                        'Authorization': `Bearer ${this.getAuthToken()}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to delete book: ${response.statusText}`);
                }

                alert(`User "${this.selectedUser.username}" has been deleted.`);

                this.usersToModify = this.usersToModify.filter(user => user._id !== this.selectedUser._id);
                this.selectedUser = null; // Reset selected book

            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Failed to delete user. Please try again.');
            }
        },
        async updateUser(updatedUser) {
            const formData = new FormData();
            formData.append('name', updatedUser.name);
            formData.append('email', updatedUser.email);
            formData.append('role', updatedUser.role);

            // Add any additional fields if required
            if (updatedUser.image) {
                formData.append('image', updatedUser.image); // Add the file object
            }

            try {
                const response = await fetch(`/api/v1/users/${this.selectedUser._id}/update`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${this.getAuthToken()}`, // No 'Content-Type', browser sets it automatically for FormData
                    },
                    body: formData, // Use FormData object as the body
                });

                if (response.ok) {
                    const data = await response.json();
                    alert('User updated successfully.');

                    // Clear fields after update
                    this.selectedUser = null;
                    this.modifiedUser = {};
                    this.searchUsers();
                } else {
                    console.error('Failed to update user:', response.statusText);
                    alert('Failed to update the user. Please try again.');
                }
            } catch (error) {
                console.error('Error updating user:', error);
                alert('An error occurred while updating the user.');
            }
        },

        // Method to retrieve the auth token (example)
        getAuthToken() {
            // This should retrieve the token from your app's state or storage
            return this.$store.getters.getAuthToken || ''; // Replace with actual method to get the token
        },
        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },
    }
};
</script>