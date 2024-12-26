<template>
    <div class="chart-container">
        <!-- Bar chart for monthly revenue -->
        <canvas ref="chartCanvas" class="chartCanvasBar"></canvas>

        <!-- Pie chart for order status -->
        <canvas ref="chartCanvasStatus" class="chartCanvasStatus"></canvas>

        <!-- Order status numbers -->
        <div class="status-summary">
            <div v-for="(value, key) in orderStatusCount" :key="key" class="status-item">
                <span class="status-label">{{ key }}</span>:
                <span class="status-value">{{ value }}</span>
            </div>
        </div>
    </div>
</template>


<script>
import {
    Chart,
    registerables
} from 'chart.js';

Chart.register(...registerables);

export default {
    name: 'ChartComponent',
    data() {
        return {
            chartInstance: null, // Tham chiếu đến biểu đồ
            chartInstanceStatus: null, // Biểu đồ trạng thái
            orderStatusCount: {}, // Dữ liệu trạng thái đơn hàng
        };
    },
    mounted() {
        this.getOrderData();
    },
    beforeDestroy() {
        if (this.chartInstance) {
            this.chartInstance.destroy();
        }
    },
    methods: {
        async getOrderData() {
            try {
                const res = await fetch('http://localhost:8081/api/v1/orders');
                const data = await res.json();
                const orders = data.data.orders;
                console.log('Dữ liệu đơn hàng:', orders);

                const currentYear = new Date().getFullYear(); // Lấy năm hiện tại

                // Lọc đơn hàng chỉ thuộc năm hiện tại
                const filteredOrders = orders.filter(order => {
                    const createdAt = new Date(order.createdAt);
                    return createdAt.getFullYear() === currentYear;
                });

                // Tính doanh thu theo từng tháng dựa trên filteredOrders
                const monthlyRevenue = filteredOrders.reduce((acc, order) => {
                    const createdAt = new Date(order.createdAt);
                    if (!isNaN(createdAt.getTime())) {
                        const month = createdAt.getMonth(); // Lấy tháng (0-11)
                        const total = order.total || 0;
                        acc[month] = (acc[month] || 0) + total;
                    }
                    return acc;
                }, {});

                // Cập nhật dữ liệu biểu đồ doanh thu
                this.updateChartData(
                    Object.keys(monthlyRevenue),
                    Object.values(monthlyRevenue)
                );

                // Tính số lượng trạng thái đơn hàng
                const orderStatusCount = filteredOrders.reduce((acc, order) => {
                    const status = order.status;
                    if (status === 'pending') {
                        acc.pending = (acc.pending || 0) + 1;
                    } else if (status === 'Shipping') {
                        acc.shipping = (acc.shipping || 0) + 1;
                    } else if (status === 'Delivered') {
                        acc.delivered = (acc.delivered || 0) + 1;
                    }
                    return acc;
                }, { pending: 0, shipping: 0, delivered: 0 });

                this.orderStatusCount = orderStatusCount; // Lưu vào data để hiển thị

                // Cập nhật dữ liệu biểu đồ trạng thái
                this.updateChartDataOrderStatus(orderStatusCount);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu:', error);
            }
        },
        updateChartData(labels, data) {
            try {
                if (this.chartInstance) {
                    this.chartInstance.destroy(); // Hủy biểu đồ cũ
                }

                this.chartInstance = new Chart(this.$refs.chartCanvas.getContext('2d'), {
                    type: 'bar',
                    data: {
                        labels: labels.map(month => `Tháng ${+month + 1}`),
                        datasets: [
                            {
                                label: 'Doanh thu (triệu đồng)',
                                data: data,
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 1,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: true,
                            },
                        },
                    },
                });
            } catch (error) {
                console.error('Error updating chart data:', error);
            }
        },
        updateChartDataOrderStatus(orderStatusCount) {
            try {
                if (this.chartInstanceStatus) {
                    this.chartInstanceStatus.destroy(); // Hủy biểu đồ trạng thái cũ nếu có
                }

                this.chartInstanceStatus = new Chart(this.$refs.chartCanvasStatus.getContext('2d'), {
                    type: 'pie',
                    data: {
                        labels: ['Pending', 'Shipping', 'Delivered'], // Nhãn mới
                        datasets: [
                            {
                                label: 'Trạng thái đơn hàng',
                                data: [
                                    orderStatusCount.pending,
                                    orderStatusCount.shipping,
                                    orderStatusCount.delivered
                                ],
                                backgroundColor: ['#ffcc00', '#007bff', '#28a745'], // Màu sắc cho các trạng thái
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                    },
                });
            } catch (error) {
                console.error('Error updating chart data for order status:', error);
            }
        }
    },
};
</script>

<style>
/* Wrapper for centering both charts */
.chart-container {
    display: flex;
    flex-direction: column;
    /* Align charts vertically */
    justify-content: center;
    /* Center vertically */
    align-items: center;
    /* Center horizontally */
    height: 100%;
    /* Ensure it takes up the full height */
}

/* Style for the bar chart */
canvas.chartCanvasBar {
    width: 100%;
    /* Use full width of the container */
    max-width: 800px;
    /* Max width for the bar chart */
    margin-bottom: 20px;
    /* Space between charts */
}

/* Style for the pie chart */
canvas.chartCanvasStatus {
    width: 400px;
    /* Set width for pie chart */
    height: 400px;
    /* Set height for pie chart */
    margin: 20px auto;
    /* Add space around pie chart */
}

.status-summary {
    margin-top: 20px;
    text-align: center;
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
}

.status-item {
    font-size: 16px;
    font-weight: bold;
}

.status-label {
    color: #333;
}

.status-value {
    color: #007bff;
}
</style>
