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

                <!-- Order List -->
        <div v-if="filteredOrders.length > 0" class="table-responsive" style="max-height: 400px; overflow-y: auto;">
            <h5 class="mt-3">Order List:</h5>
            <table class="table table-bordered">
                <thead class="table-light">
                    <tr>
                        <th>Order ID</th>
                        <th>Customer Name</th>
                        <th>Order Date (UTC+7)</th>
                        <th>Status</th>
                        <th>Total Amount (VND)</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="order in filteredOrders" :key="order._id">
                        <td>{{ order._id }}</td> <!-- Display order ID -->
                        <td>{{ order.details.name }}</td> <!-- Display customer name -->
                        <td>{{ formatToUTC7(order.createdAt) }}</td> <!-- Display formatted order date -->
                        <td>{{ order.status }}</td> <!-- Display order status -->
                        <td>{{ order.total.toLocaleString() }}</td> <!-- Display total amount -->
                        <td>
                            {{ order.details.street }}, {{ order.details.district }}, {{ order.details.city }} <!-- Address -->
                        </td>
                        <td>
                            <button 
                                class="btn btn-sm"
                                :class="{
                                    'btn-warning': order.status.toLowerCase() === 'pending',
                                    'btn-primary': order.status.toLowerCase() === 'shipping',
                                    'btn-success': order.status.toLowerCase() === 'delivered'
                                }"
                                :disabled="order.status.toLowerCase() === 'delivered'"
                                @click="changeStatus(order)"
                            >
                                {{ getNextStatus(order.status) }}
                            </button>
                        </td>

                    </tr>
                </tbody>
            </table>
        </div>

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
        };
    },
    computed: {
        filteredOrders() {
            return this.orders.filter(order => {
                // Match by Order ID
                const matchesId = this.orderId ? order._id.includes(this.orderId) : true;
                
                // Match by Customer Name
                const matchesName = this.customerName
                    ? order.details.name.toLowerCase().includes(this.customerName.toLowerCase())
                    : true;
                
                // Match by Order Status
                const matchesStatus = this.orderStatus ? order.status.toLowerCase() === this.orderStatus.toLowerCase() : true;
                
                // Match by Start Date
                const matchesStartDate = this.startDate
                    ? new Date(order.createdAt) >= new Date(this.startDate)
                    : true;
                
                // Match by End Date
                const matchesEndDate = this.endDate
                    ? new Date(order.createdAt) <= new Date(this.endDate)
                    : true;

                // Return the combined result
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
                const response = await fetch(`http://localhost:8081/api/v1/orders`); // Perform GET request
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json(); // Parse JSON response

                return data.data.orders; // Return the orders array
            } catch (error) {
                console.error("Failed to fetch orders:", error.message);
                return []; // Return an empty array in case of an error
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
            const currentIndex = statuses.indexOf(currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1).toLowerCase()); // Normalize status
            return currentIndex < 2 ? statuses[currentIndex + 1] : '';
        },

        changeStatus(order) {
            const nextStatus = this.getNextStatus(order.status);
            if (nextStatus) {
                // Update the order status in the database by calling the API
                this.updateOrderStatus(order._id, nextStatus)
                    .then(() => {
                        // Update the local order status after the API call
                        order.status = nextStatus;
                    })
                    .catch(error => {
                        console.error("Failed to update order status:", error);
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
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();

            } catch (error) {
                console.error("Failed to update order status:", error.message);
            }
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
.table {
    margin-top: 20px;
}
</style>
