<template>
    <header>
      <nav class="navbar navbar-expand-lg bg-primary">
        <div class="container-fluid">
          <!-- Brand/Logo -->
          <RouterLink to="/shop" class="navbar-brand">
            Home
          </RouterLink>
  
          <!-- Toggler for mobile view -->
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
  
          <!-- Navigation Links -->
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav me-auto">
              <li class="nav-item">
                <RouterLink to="/shop/users" class="nav-link">User Management</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink to="/shop/analytics" class="nav-link">Analytics</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink to="/shop/settings" class="nav-link">Settings</RouterLink>
              </li>
            </ul>
  
            <!-- Logout Button -->
            <div class="d-flex">
              <button @click="logout" class="btn btn-danger btn-sm">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  </template>
  
  <script>
  import { RouterLink } from "vue-router";

  export default {
    name: "adminHeader",
    methods: {
      logout() {
        // Clear token and redirect to login
        localStorage.removeItem("authToken");
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem('userRole');
        this.$router.push("/");
      },
    },
  };
  </script>
  
  <style scoped>
  /* Customize header styles */
  .navbar-brand {
    font-weight: bold;
    font-size: 1.25rem;
  }
  .nav-link {
    color: #ffffff !important;
  }
  .nav-link:hover {
    text-decoration: underline;
  }
  </style>
  