<template>
    <div class="card">
        <div class="card-header mb-3">
            <h3>Order Management</h3>
        </div>
        
        <!-- Search Filters -->
        <div class="row d-flex align-items-center mb-3">
            <div class="col-4 text-end">
                <span>Order ID</span>
            </div>
            <div class="col-8">
                <input 
                    type="text" 
                    class="form-control" 
                    v-model="orderId" 
                    placeholder="Enter Order ID">
            </div>
        </div>
        <div class="row d-flex align-items-center mb-3">
            <div class="col-4 text-end">
                <span>Customer Name</span>
            </div>
            <div class="col-8">
                <input 
                    type="text" 
                    class="form-control" 
                    v-model="customerName" 
                    placeholder="Enter Customer Name">
            </div>
        </div>
        <div class="row d-flex align-items-center mb-3">
            <div class="col-4 text-end">
                <span>Status</span>
            </div>
            <div class="col-8">
                <select class="form-control" v-model="orderStatus">
                    <option value="">All</option>
                    <option>Pending</option>
                    <option>Shipping</option>
                    <option>Delivered</option>
                </select>
            </div>
        </div>
        <div class="row d-flex align-items-center mb-3">
            <div class="col-4 text-end">
                <span>From Date</span>
            </div>
            <div class="col-8">
                <input 
                    type="date" 
                    class="form-control" 
                    v-model="startDate">
            </div>
        </div>
        <div class="row d-flex align-items-center mb-3">
            <div class="col-4 text-end">
                <span>To Date</span>
            </div>
            <div class="col-8">
                <input 
                    type="date" 
                    class="form-control" 
                    v-model="endDate">
            </div>
        </div>
        <!-- Selected Order Details -->
        <div v-if="selectedOrder" class="selected-order mt-4">
            <h5>Order Details:</h5>
            <p><strong>Order ID:</strong> {{ selectedOrder._id }}</p>
            <p><strong>Customer Name:</strong> {{ selectedOrder.details.name }}</p>
            <p><strong>Phone Number:</strong> {{ selectedOrder.details.phone }}</p>
            <p><strong>Address:</strong> 
                 {{ selectedOrder.details.number }},{{ selectedOrder.details.street }}, {{ selectedOrder.details.district }}, {{ selectedOrder.details.city }}
            </p>
            <p><strong>Total Amount:</strong> {{ selectedOrder.total.toLocaleString() }} USD</p>
            <p><strong>Status:</strong> {{ selectedOrder.status }}</p>
            <p><strong>Products:</strong> </p>
                <li v-for="item in selectedOrder.items" :key="item.bookId">{{ item.bookName }} (x{{ item.quantity }})</li>

        </div>
        <!-- Order List -->
        <div v-if="filteredOrders.length > 0" class="table-responsive" style="max-height: 400px; overflow-y: auto;">
            <h5 class="mt-3">Order List:</h5>
            <table class="table table-bordered">
                <thead class="table-light">
                    <tr>
                        <th>Order ID</th>
                        <th>Order Date (UTC+7)</th>
                        <th>Products</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr 
                        v-for="order in filteredOrders" 
                        :key="order._id" 
                        @click="selectOrder(order)" 
                        class="clickable-row"
                    >
                        <td>{{ order._id }}</td>
                        <td>{{ formatToUTC7(order.createdAt) }}</td>
                        <td>           
                               <li v-for="item in order.items" :key="item.bookId">{{ item.bookName }} (x{{ item.quantity }})</li>
                        </td>
                        <td>{{ order.status }}</td>
                        <td>
                            <button 
                                class="btn btn-sm"
                                :class="{
                                    'btn-warning': order.status.toLowerCase() === 'pending',
                                    'btn-primary': order.status.toLowerCase() === 'shipping',
                                    'btn-success': order.status.toLowerCase() === 'delivered'
                                }"
                                :disabled="order.status.toLowerCase() === 'delivered'"
                                @click.stop="changeStatus(order)"
                            >
                                {{ getNextStatus(order.status) }}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- No Orders Found -->
        <div v-else>
            <p class="text-muted">No orders found.</p>
        </div>


    </div>
</template>

<script>
export default {
    name: "orderManagementComponent",
    data() {
        return {
            orderId: '',
            customerName: '',
            orderStatus: '',
            startDate: '',
            endDate: '',
            orders: [],
            selectedOrder: null, // Track selected order
        };
    },
    computed: {
        filteredOrders() {
            const sortedOrders = [...this.orders].sort((a, b) => {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                return dateB - dateA;  // Sort in descending order (latest first)
            });

            return sortedOrders.filter(order => {
                const matchesId = this.orderId ? order._id.includes(this.orderId) : true;
                const matchesName = this.customerName
                    ? order.details.name.toLowerCase().includes(this.customerName.toLowerCase())
                    : true;
                const matchesStatus = this.orderStatus
                    ? order.status.toLowerCase() === this.orderStatus.toLowerCase()
                    : true;
                const matchesStartDate = this.startDate
                    ? new Date(order.createdAt) >= new Date(this.startDate)
                    : true;
                const matchesEndDate = this.endDate
                    ? new Date(order.createdAt) <= new Date(this.endDate)
                    : true;
                return matchesId && matchesName && matchesStatus && matchesStartDate && matchesEndDate;
            });
        }
    },
    async mounted() {
        this.orders = await this.getAllOrders();
    },
    methods: {
        async getAllOrders() {
            try {
                const response = await fetch('http://localhost:8081/api/v1/orders');
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                
                const data = await response.json();
                console.log(data.data.orders);

                // Fetch book details for each order item
                const ordersWithBooks = await Promise.all(data.data.orders.map(async (order) => {
                    const itemsWithDetails = await Promise.all(order.items.map(async (item) => {
                        console.log('Fetching book for cart item:', item);
                        try {
                            // Fetch cart item details
                            const cartItemResponse = await fetch(`http://localhost:8081/api/v1/users/cart/item/${item._id}`);
                            const cartItemData = await cartItemResponse.json();
                            console.log('Cart item data:', cartItemData);

                            if (cartItemData.data) {
                                item.quantity = cartItemData.data.quantity;

                                // Fetch book details using the bookId from the cartItem
                                const bookResponse = await fetch(`http://localhost:8081/api/v1/books/${cartItemData.data.book}`);
                                const bookData = await bookResponse.json();

                                if (bookData.data && bookData.data.book) {
                                    item.bookName = bookData.data.book.title; // Assign book title to item
                                } else {
                                    item.bookName = 'Unknown Book'; // Fallback if book not found
                                }
                            } else {
                                item.bookName = 'Unknown Book'; // Fallback if cart item not found
                                item.quantity = 0;
                            }
                        } catch (error) {
                            console.error(`Error fetching book for cart item ${item._id}:`, error.message);
                            item.bookName = 'Error Fetching Book'; // Fallback in case of an error
                            item.quantity = 0;
                        }

                        return item;
                    }));

                    return { ...order, items: itemsWithDetails };
                }));

                // Update the orders array with books information
                console.log(ordersWithBooks);

                return ordersWithBooks;

            } catch (error) {
                console.error('Failed to fetch orders:', error.message);
                return [];
            }
        },

        formatToUTC7(date) {
            const utcDate = new Date(date);
            const utc7Date = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);
            return utc7Date.toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });
        },
        getNextStatus(currentStatus) {
            const statuses = ['Pending', 'Shipping', 'Delivered'];
            const currentIndex = statuses.indexOf(currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1).toLowerCase());
            return currentIndex < 2 ? statuses[currentIndex + 1] : '';
        },
        changeStatus(order) {
            const nextStatus = this.getNextStatus(order.status);
            if (nextStatus) {
                this.updateOrderStatus(order._id, nextStatus)
                    .then(() => {
                        order.status = nextStatus;
                    })
                    .catch(error => {
                        console.error("Failed to update order status:", error.message);
                    });
            }
        },
        async updateOrderStatus(orderId, status) {
            try {
                const response = await fetch(`http://localhost:8081/api/v1/orders/${orderId}/update`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ status }),
                });
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            } catch (error) {
                console.error("Failed to update order status:", error.message);
            }
        },
        selectOrder(order) {
            this.selectedOrder = order; // Set selected order
        }
    }
};
</script>

<style scoped>
.card {
    margin: 20px;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: #f9f9f9;
}
.table-responsive {
    border: 1px solid #ccc;
    border-radius: 8px;
    overflow-y: auto;
}
.clickable-row {
    cursor: pointer;
    transition: background-color 0.2s ease;
}
.clickable-row:hover {
    background-color: #f0f0f0;
}
.selected-order{
    border: 1px solid #ccc;
    border-radius: 8px;
    padding:10px;
    background-color:#f9f9f9;
    margin-bottom: 10px;
}
</style>
