import { createStore } from 'vuex';
import Swal from 'sweetalert2';

const guestUserId = "12123124123124"

export default createStore({
  state: {
    orders: [],
    isAuthenticated: false,
    authToken: null,
    userId: null,
    role: null,
    cartItems: [],
  },
  mutations: {
    setOrders(state, orders) {
      state.orders = orders; // Update orders in the state
    },
    setAuthentication(state, { authToken, role, userId }) {
      state.isAuthenticated = true;
      state.authToken = authToken;
      state.role = role;
      state.userId = userId;
      Swal.fire({
        title: "Welcome!",
        text: "You have successfully logged in",
        icon: "success"
      });
    },
    logout(state) {
      state.isAuthenticated = false;
      state.authToken = null;
      state.role = null;
      state.userId = null;
      state.cartItems = [];
      Swal.fire({
        title: "Goodbye!",
        text: "You have successfully logged out",
        icon: "success"
      });
    },
    async fetchCart(state) {
      try {

        const res = await fetch(`/api/v1/users/${state.userId}/cart`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${state.authToken}`,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error('Failed to fetch cart');
        }
        state.cartItems = data.data;
      } catch (error) {
        console.error(error);
        state.cartItems = [];
      }
    },
    addToCart(state, { book }) {
      // Check if the book is already in the cart
      const existingBook = state.cartItems.find(item => item._id === book._id);

      if (existingBook) {
        // If the book is already in the cart, increment the quantity
        existingBook.quantity += 1;
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `${book.title} quantity has been updated in your cart`,
          showConfirmButton: false,
          timer: 1000
        });
      } else {
        // If the book is not in the cart, add it with quantity 1
        state.cartItems.push({ ...book, quantity: 1 });
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `${book.title} has been added to your cart`,
          showConfirmButton: false,
          timer: 1000
        });
      }
    },
    removeFromCart(state, { book }) {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger mx-2"
        },
        buttonsStyling: false
      });
      swalWithBootstrapButtons.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, remove it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            if (state.isAuthenticated) {
              const res = await fetch(`/api/v1/users/${state.userId}/removeCart/${book._id}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${state.authToken}`,
                },
              });
              if (!res.ok) {
                throw new Error('Failed to fetch cart');
              }
            }
            // Remove the book entirely from the cart
            state.cartItems = state.cartItems.filter(item => item._id !== book._id);
            swalWithBootstrapButtons.fire({
              title: "Removed!",
              text: `${book.title} has been removed from your cart`,
              icon: "success"
            });
          }
          catch (error) {
            console.error(error);
            swalWithBootstrapButtons.fire({
              title: "Failed!",
              text: "Failed to remove the book from your cart",
              icon: "error"
            });
          }
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            icon: "error"
          });
        }
      });
    },
    emptyCart(state) {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger mx-2"
        },
        buttonsStyling: false
      });
      swalWithBootstrapButtons.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, remove all items!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true
      }).then(async (result) => {
        if (result.isConfirmed) {
          // Empty the cart
          state.cartItems = [];
          if (state.isAuthenticated) {
            const res = await fetch(`/api/v1/users/${state.userId}/removeCart`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${state.authToken}`,
              },
            });

            if (!res.ok) {
              throw new Error('Failed to empty cart');
            }
          }
          swalWithBootstrapButtons.fire({
            title: "Emptied!",
            text: "Your cart is now empty",
            icon: "success"
          });
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            icon: "error"
          });
        }
      });
    }
  },
  actions: {
    async checkout({ state, dispatch }, checkoutDetails) {
      try {
        let response;
        if (state.isAuthenticated) {
          response = await fetch(
            `/api/v1/users/${state.userId}/payment`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${state.authToken}`,
              },
              body: JSON.stringify({
                ...checkoutDetails,
                total: checkoutDetails.total, // Include cart items from Vuex state
                items: state.cartItems,
              }),
            }
          );
        } else {
          response = await fetch(
            `/api/v1/users/${guestUserId}/payment`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${state.authToken}`,
              },
              body: JSON.stringify({
                ...checkoutDetails,
                total: checkoutDetails.total,
                items: state.cartItems,
              }),
            }
          );
        }

        const result = await response.json();
        if (result.code === 1) {
          Swal.fire({
            title: "Success",
            text: result.message,
            icon: "success",
          });
          dispatch("fetchCart"); // Clear cart after successful checkout
        } else {
          Swal.fire({
            title: "Error",
            text: result.message,
            icon: "error",
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: `Checkout failed: ${error.message}`,
          icon: "error",
        });
      }
    },
    login({ commit }, { authToken, role, userId }) {
      // Simulate an API call to authenticate the user
      commit('setAuthentication', { authToken, role, userId });
    },
    logout({ commit }) {
      // Simulate an API call to log the user out
      commit('logout');
    },
    addToCart({ commit }, { book }) {
      commit('addToCart', { book });
    },
    removeFromCart({ commit }, { book }) {
      commit('removeFromCart', { book });
    },
    emptyCart({ commit }) {
      commit('emptyCart');
    },
    increaseQ({ commit }, { book }) {
      book.quantity += 1;
    },
    decreaseQ({ commit }, { book }) {
      if (book.quantity > 1) {
        book.quantity -= 1;
      }
    },
    async updateCart({ state }) {
      if (!state.isAuthenticated) {
        Swal.fire({
          title: "Please login first",
          text: "You need to login to save your shopping progress",
          icon: "warning",
        });

        return;
      }

      for (const item of state.cartItems) {
        try {
          // Make a DELETE request to the API to delete the book
          const response = await fetch(`/api/v1/users/${state.userId}/addCart`, {
            method: 'POST', // Specify the method as DELETE
            headers: {
              'Content-Type': 'application/json',
              // Add any additional headers you need, such as authorization token
              'Authorization': `Bearer ${state.authToken}`,
            },
            body: JSON.stringify({ bookName: item.title, quantity: item.quantity }),
          });

          if (!response.ok) {
            throw new Error('Failed to update cart');
          }
        } catch (error) {
          console.error(error);
        }
      };
      Swal.fire({
        title: "Updated!",
        text: "Your cart has been updated",
        icon: "success",
        showConfirmButton: false,
        timer: 1000,
      });
    },
    fetchCart({ commit }) {
      commit('fetchCart');
    },
    async fetchOrders({ commit, state }) {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage or any secure storage
      try {
        const response = await fetch('http://localhost:8081/api/v1/orders/myOrders', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Include the token
          },
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // Parse JSON response
        commit('setOrders', data.data.orders); // Commit the orders to Vuex state
      } catch (error) {
        console.error('Failed to fetch orders:', error.message);
        commit('setOrders', []); // Commit an empty array in case of an error
      }
    },
  },
  getters: {
    isAuthenticated: (state) => state.isAuthenticated,
    getAuthToken: (state) => state.authToken,
    getRole: (state) => state.role,
    getUserId: (state) => state.userId,
    getCartItems: (state) => state.cartItems,
    countCartItems: (state) => state.cartItems.length,
    getOrders: (state) => state.orders,
  },
});
