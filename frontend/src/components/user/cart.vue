<template>
  <div class="row my-4">
    <div class="col-md-12 align-content-center" style="min-height: 400px;">
      <div class="card mx-auto w-75" v-if="this.$store.getters.countCartItems">
        <div class="card-body">
          <table class="table">
            <thead>
              <tr>
                <th class="text-center">#</th>
                <th style="width: 100px;"></th>
                <th></th>
                <th class="text-center">Quantity</th>
                <th class="text-center">Price</th>
                <th class="text-center">Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in data" :key="item._id">
                <td class="text-center align-middle h5">{{ index + 1 }}</td>
                <td class="text-center">
                  <img :src="item.image" class="img-fluid rounded" width="100" height="160" :alt="item.name" />
                </td>
                <td>
                  <div class="h4">
                    {{ item.title }}
                  </div>
                  <div>
                    <span class="lead">{{ item.author }}</span>
                  </div>
                </td>
                <td class="text-center">
                  <i @click="this.$store.dispatch('increaseQ', { book: item })" class="bi bi-caret-up"></i>
                  <span class="mx-2">
                    {{ item.quantity }}
                  </span>
                  <i @click="this.$store.dispatch('decreaseQ', { book: item })" class="bi bi-caret-down"></i>
                </td>
                <td class="text-center">
                  ${{ item.price }}
                </td>
                <td class="text-center">
                  ${{ (item.price * item.quantity).toFixed(2) }}
                </td>
                <td class="text-center">
                  <i @click="this.$store.dispatch('removeFromCart', { book: item })" class="bi bi-cart-x text-danger"></i>
                </td>
              </tr>
              <tr>
                <th colspan="4"></th>
                <th colspan="2" class="text-end">
                  Total:
                  <span class="badge bg-danger rounded-pill">${{ data.reduce((acc, item) => acc += item.price * item.quantity, 0).toFixed(2) }}</span>
                </th>
                <th colSpan="1"></th>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" class="align-middle">
                  <router-link to="/" class="btn btn-secondary rounded-pill" role="button" style="width: 110px;">Go back</router-link>
                </td>
                <td colspan="4" class="text-end">
                  <button class="btn btn-outline-danger rounded-pill mx-2" role="button" style="width: 110px;" @click="this.$store.dispatch('emptyCart')">
                    Empty cart
                  </button>
                  <button class="btn btn-outline-danger rounded-pill" role="button" style="width: 110px;"
                    @click="this.$store.dispatch('updateCart')">Update</button>
                  <router-link to="/cart/checkout" class="btn btn-danger rounded-pill ms-2" style="width: 110px;">Checkout</router-link>
                </td>
                <td colspan="1"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div v-else class="text-center m-auto">
          <div class="h2">Your cart is empty!</div>
          <router-link to="/" class="btn btn-danger rounded-pill mx-2 mb-2">Continue shopping</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Cart',
  computed: {
    // Get cart items directly from Vuex store
    data() {
      return this.$store.getters.getCartItems;
    }
  },
}
</script>

<style scoped>
i {
  cursor: pointer;
}
</style>