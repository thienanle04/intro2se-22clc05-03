<template>
    <div class="container d-flex justify-content-center align-items-start my-4">
        <!-- Checkout Form Section -->
        <div class="col-6 me-4">
            <form @submit.prevent="checkout" class="p-4 rounded shadow-sm bg-light">
                <!-- Name Input Row -->
                <div class="row mb-3">
                    <div class="col">
                        <input type="text" v-model="checkoutDetails.name" id="name" class="form-control"
                            placeholder="Name" required />
                    </div>
                </div>

                <!-- Email and Phone Input Row -->
                <div class="row mb-3">
                    <div class="col">
                        <input type="email" v-model="checkoutDetails.email" id="email" class="form-control"
                            placeholder="Email" required />
                    </div>
                    <div class="col">
                        <input type="text" v-model="checkoutDetails.phone" id="phone" class="form-control"
                            placeholder="Phone" required />
                    </div>
                </div>

                <!-- Address Input Rows -->
                <div class="row mb-3">
                    <div class="col-4">
                        <input type="text" v-model="checkoutDetails.number" id="number" class="form-control"
                            placeholder="Address Number" required />
                    </div>
                    <div class="col-4">
                        <input type="text" v-model="checkoutDetails.street" id="street" class="form-control"
                            placeholder="Street" required />
                    </div>
                    <div class="col-4">
                        <input type="text" v-model="checkoutDetails.ward" id="ward" class="form-control"
                            placeholder="Ward" required />
                    </div>
                </div>

                <div class="row mb-3">
                    <div class="col-6">
                        <input type="text" v-model="checkoutDetails.district" id="district" class="form-control"
                            placeholder="District" required />
                    </div>
                    <div class="col-6">
                        <input type="text" v-model="checkoutDetails.city" id="city" class="form-control"
                            placeholder="City" required />
                    </div>
                </div>

                <!-- Submit Button -->
                <button type="submit" class="btn btn-danger btn-block">Checkout Payment</button>
            </form>
        </div>

        <!-- Cart Section -->
        <div class="col-6 me-4">
            <div class="card shadow-sm">
                <div class="card-header bg-danger text-white">
                    <h5>Your Cart</h5>
                </div>
                <div class="card-body">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Quantity</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in cartItems" :key="item._id">
                                <td class="text-center">
                                    <img :src="item.image" class="img-fluid rounded" width="60" height="100"
                                        :alt="item.name" />
                                </td>
                                <td>{{ index + 1 }}</td>
                                <td>{{ item.title }}</td>
                                <td>{{ item.author }}</td>
                                <td>{{ item.quantity }}</td>
                                <td>${{ (item.price * item.quantity).toFixed(2) }}</td>
                            </tr>
                            <tr>
                                <th colspan="5" class="text-end">Total:</th>
                                <th>${{ totalPrice.toFixed(2) }}</th>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Checkout",
    computed: {
        cartItems() {
            return this.$store.getters.getCartItems;
        },
        totalPrice() {
            return this.cartItems.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );
        },
    },
    data() {
        return {
            checkoutDetails: {
                name: "",
                email: "",
                phone: "",
                number: "",
                street: "",
                district: "",
                ward: "",
                city: "",
            },
        };
    },
    methods: {
        checkout() {
            this.$store.dispatch("checkout", {
                ...this.checkoutDetails,
                total: this.totalPrice,
            });
            this.$router.push("/");
        },
    },
};
</script>

<style scoped>
.container {
    max-width: 1200px;
}

.card {
    border-radius: 5px;
}

.table th,
.table td {
    vertical-align: middle;
}

form {
    background-color: #F9EBEB;
}

button {
    width: 100%;
    padding: 10px;
    font-size: 16px;
}
</style>