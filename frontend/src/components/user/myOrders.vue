<template>
  <div class="container mt-5">
    <h1 class="mb-4">My Orders</h1>
    <table class="table table-striped table-bordered">
      <thead class="thead-dark">
        <tr>

          <th>Order Date (UTC+7)</th>
          <th>Status</th>
          <th>Total (VND)</th>
          <th>Address</th>
          <th>Phone number</th>
          <th>Products</th> <!-- New column for products -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order._id">

          <td>{{ formatToUTC7(order.createdAt) }}</td>
          <td>{{ order.status }}</td>
          <td>{{ formatCurrency(order.total) }}</td>
          <td>{{ order.details.phone }}</td>

          <td>
            {{ order.details.number }},{{ order.details.street }}, {{ order.details.ward }}, {{ order.details.district
            }}, {{ order.details.city }}
          </td>
          <td>
            <!-- Display product names -->
            <ul>
              <li v-for="item in order.items" :key="item.bookId">{{ item.bookName }} (x{{ item.quantity }})</li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'MyOrders',
  data() {
    return {
      orders: [], // Holds the list of orders
    };
  },
  methods: {
    async fetchOrders() {
      const token = this.$store.state.authToken; // Retrieve token from your store

      try {
        const response = await fetch('http://localhost:8081/api/v1/orders/myOrders', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache', // Prevent caching
            Authorization: `Bearer ${token}`, // Include the token
          },
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // Parse JSON response
        console.log('Orders:', data.data);

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
              item.name = 'Error Fetching Book'; // Fallback in case of an error
              item.quantity = 0;
            }

            return item;
          }));

          return { ...order, items: itemsWithDetails };
        }));

        // Update the orders array with books information
        this.orders = ordersWithBooks;

      } catch (error) {
        console.error('Failed to fetch orders:', error.message);
        this.orders = []; // Ensure orders are always an array
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
        hour12: false,
      });
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    },
  },
  mounted() {
    this.fetchOrders(); // Fetch orders when the component is mounted
  },
};
</script>

<style scoped>
.table {
  margin-top: 20px;
}
</style>
