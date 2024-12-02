import { createStore } from 'vuex';
import Swal from 'sweetalert2';

export default createStore({
  state: {
    isAuthenticated: false,
    authToken: null,
    role: null,
    userId: null,
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
      }).then((result) => {
        if (result.isConfirmed) {
          // Empty the cart
          state.cartItems = [];
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
