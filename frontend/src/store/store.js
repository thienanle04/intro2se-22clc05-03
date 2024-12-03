import { createStore } from 'vuex';
import Swal from 'sweetalert2';

export default createStore({
  state: {
    isAuthenticated: true,
    authToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3M2EyZGNjNGI5ODEwNTg1MWFkNDI2NyIsInVzZXJuYW1lIjoidGhpZW5hbmxlMDQiLCJyb2xlIjoiY3VzdG9tZXIiLCJpYXQiOjE3MzMxOTExMjgsImV4cCI6MTczMzI3NzUyOH0.l5FoHkuBYP54YHvtGcTIN-7ZeeWC3l44Ox63Rv3kpZI',
    userId: '673a2dcc4b98105851ad4267',
    // isAuthenticated: false,
    // authToken: null,
    // userId: null,
    role: null,
    cartItems: [],
  },
  mutations: {
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
      // Simulate an API call to fetch the cart items
      const res = await fetch(`/api/v1/users/${state.userId}/cart`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.authToken}`,
        },
      });
      const data = await res.json();
      state.cartItems = data.data;
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
      }).then((result) => {
        if (result.isConfirmed) {
          // Remove the book entirely from the cart
          state.cartItems = state.cartItems.filter(item => item._id !== book._id);
          swalWithBootstrapButtons.fire({
            title: "Removed!",
            text: `${book.title} has been removed from your cart`,
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
          const res = await fetch(`/api/v1/users/${state.userId}/removeCart`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${state.authToken}`,
            },
          });
          if (res.ok) {
            swalWithBootstrapButtons.fire({
              title: "Emptied!",
              text: "Your cart is now empty",
              icon: "success"
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
    }
  },
  actions: {
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
      // Simulate an API call to update the cart
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
    }
  },
  getters: {
    isAuthenticated: (state) => state.isAuthenticated,
    getAuthToken: (state) => state.authToken,
    getRole: (state) => state.role,
    getUserId: (state) => state.userId,
    getCartItems: (state) => state.cartItems,
    countCartItems: (state) => state.cartItems.length,
  },
});
