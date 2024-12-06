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
                    <tr v-for="order in filteredOrders" :key="order.id">
                        <td>{{ order.id }}</td>
                        <td>{{ order.customerName }}</td>
                        <td>{{ formatToUTC7(order.orderDate) }}</td>
                        <td>{{ order.status }}</td>
                        <td>{{ order.totalAmount.toLocaleString() }}</td>
                        <td>{{ order.address }}</td>
                        <td>
                            <button 
                                class="btn btn-sm"
                                :class="{
                                    'btn-warning': order.status === 'Pending',
                                    'btn-primary': order.status === 'Shipping',
                                    'btn-success': order.status === 'Delivered'
                                }"
                                :disabled="order.status === 'Delivered'"
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
                const matchesId = this.orderId ? order.id.includes(this.orderId) : true;
                const matchesName = this.customerName
                    ? order.customerName.toLowerCase().includes(this.customerName.toLowerCase())
                    : true;
                const matchesStatus = this.orderStatus ? order.status === this.orderStatus : true;
                const matchesStartDate = this.startDate
                    ? new Date(order.orderDate) >= new Date(this.startDate)
                    : true;
                const matchesEndDate = this.endDate
                    ? new Date(order.orderDate) <= new Date(this.endDate)
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
            // todo: lấy data từ databse
            const fakeOrders = [
                {
                    id: 'ORD001',
                    customerName: 'fake data',
                    orderDate: '2024-11-25T12:34:56Z',
                    status: 'Pending',
                    totalAmount: 500000,
                    address: '123 Elm Street'
                },
                {
                    id: 'ORD002',
                    customerName: 'Jane Smith',
                    orderDate: '2024-11-24T10:00:00Z',
                    status: 'Delivered',
                    totalAmount: 750000,
                    address: '456 Oak Avenue'
                },
                {
                    id: 'ORD003',
                    customerName: 'Michael Lee',
                    orderDate: '2024-11-23T15:45:30Z',
                    status: 'Shipping',
                    totalAmount: 300000,
                    address: '789 Pine Road'
                },
                {
                    id: 'ORD004',
                    customerName: 'Sarah Taylor',
                    orderDate: '2024-11-22T08:20:15Z',
                    status: 'Pending',
                    totalAmount: 250000,
                    address: '321 Maple Lane'
                },
                {
                    id: 'ORD005',
                    customerName: 'Emily Clark',
                    orderDate: '2024-11-21T16:50:00Z',
                    status: 'Shipping',
                    totalAmount: 1000000,
                    address: '789 Birch Boulevard'
                },
                {
                    id: 'ORD006',
                    customerName: 'David Wilson',
                    orderDate: '2024-11-20T13:00:10Z',
                    status: 'Pending',
                    totalAmount: 450000,
                    address: '135 Cedar Street'
                }
            ];
            return fakeOrders;
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
            const currentIndex = statuses.indexOf(currentStatus);
            return currentIndex < 2 ? statuses[currentIndex + 1] : '';
        },


        changeStatus(order) {
            const nextStatus = this.getNextStatus(order.status);
            if (nextStatus) {
        //todo: cập nhật trạng thái status của order trên database

                order.status = nextStatus;
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
