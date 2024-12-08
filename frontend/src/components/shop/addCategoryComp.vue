<template>
    <div class="card">
        <div class="card-header mb-3">
            <h3>Add New Category</h3>
        </div>

        <div class="row d-flex align-items-center mb-3">
            <div class="col-5 text-end">
                <span>CategoryName</span>
            </div>
            <div class="col-7">
                <input type="text" class="form-control" v-model="cat.name" placeholder="CategoryName"
                    aria-label="CategoryName" required>
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
    name: 'addCategoryComponent',
    data() {
        return {
            cat: {
                name: "",
            },
        };
    },
    methods: {
        createNewCategory() {
            return {
                name: this.cat.name || "Null", // Replace with dynamic value
            };
        },
        async submit() {
            if (!this.cat.name) {
                alert('Please fill in the category field.');
                return;
            }
            try {
                // Create a FormData object
                const formData = {
                    name: this.cat.name,
                };

                const response = await fetch('http://localhost:8081/api/v1/genres', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Authorization': `Bearer ${this.getAuthToken()}`, // Authorization header
                    },
                    body: JSON.stringify(formData), // Pass FormData object as the body
                });

                if (!response.ok) {
                    throw new Error(`Failed to add user: ${response.statusText}`);
                }

                const data = await response.json();
                alert(`User "${this.cat.name}" has been successfully added.`);
                this.clearForm();
            } catch (error) {
                console.error('Error adding category:', error);
                alert('Failed to add category. Please try again.');
            }
            window.location.href = '/shop/modifyCategory';
        },
        clearForm() {
            this.cat = {
                name: "",
            };
        },

        getAuthToken() {
            // Retrieve the token from storage or app state
            return this.$store.getters.getAuthToken || ''; // Replace with actual token retrieval logic
        },
    },
};
</script>
