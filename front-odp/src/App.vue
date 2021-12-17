<template>
  <div id="nav" v-if="isAdmin">
    <router-link to="/">Home</router-link> |
    <router-link to="/sale">Sale</router-link> |
    <router-link to="/dashboard">Dashboard</router-link> |
    <router-link to="/admin">Admin</router-link> |
    <router-link to="/masterstock">Masterstock</router-link> |
    <router-link to="/register">Register</router-link> |
    <router-link to="/login">Login</router-link> |
    <button @click="logout">Logout</button>
  </div>
  <div v-else class="mb-12"></div>
  <router-view />
  <Footer />
</template>

<script>
import Footer from "./components/Footer.vue";

export default {
  components: {
    Footer,
  },
  methods: {
    logout() {
      this.$store.dispatch("auth/logout");
      this.$router.push("login");
    },
  },
  mounted() {
    console.log(this.$store.state.auth.user.role);
  },
  computed: {
    isAdmin() {
      if (!this.$store.state.auth.user) {
        return false;
      }
      if (this.$store.state.auth.user.role === "ROLE_ADMIN") {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>

<style lang="scss">
#nav {
  text-align: center;
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
