<template>
    <div class="chart-container">
        <!-- Bar chart for monthly revenue -->
        <canvas ref="chartCanvas" class="chartCanvasBar"></canvas>

        <!-- Pie chart for order status -->
        <canvas ref="chartCanvasStatus" class="chartCanvasStatus"></canvas>
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

                // Tính doanh thu theo từng tháng dựa trên order.createdAt
                const monthlyRevenue = orders.reduce((acc, order) => {
                    const createdAt = new Date(order.createdAt); // Chuyển `createdAt` thành kiểu Date
                    if (!isNaN(createdAt.getTime())) { // Kiểm tra ngày hợp lệ
                        const month = createdAt.getMonth(); // Lấy tháng (1-12)
                        const total = order.total || 0; // Mặc định doanh thu là 0 nếu `total` không hợp lệ
                        acc[month] = (acc[month] || 0) + total; // Tính tổng doanh thu theo tháng
                    }
                    return acc;
                }, {});
                // Cập nhật dữ liệu biểu đồ
                this.updateChartData(Object.keys(monthlyRevenue), Object.values(monthlyRevenue));
                const orderStatusCount = orders.reduce((acc, order) => {
                    const status = order.status; // Giả sử trạng thái được lưu trong trường `status`
                    if (status === 'pending') {
                        acc.pending = (acc.pending || 0) + 1;
                    } else if (status === 'delivery') {
                        acc.delivery = (acc.delivery || 0) + 1;
                    } else if (status === 'done') {
                        acc.done = (acc.done || 0) + 1;
                    }
                    return acc;
                }, { pending: 0, done: 0, delivery: 0 });
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
                        labels: ['Pending', 'Delivery', 'Done'],
                        datasets: [
                            {
                                label: 'Trạng thái đơn hàng',
                                data: [
                                    orderStatusCount.pending,
                                    orderStatusCount.delivery,
                                    orderStatusCount.done
                                ],
                                backgroundColor: ['#ffcc00', '#28a745', '#dc3545'], // Màu sắc cho mỗi trạng thái
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
</style>
