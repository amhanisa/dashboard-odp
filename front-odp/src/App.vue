<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/sale">Sale</router-link> |
    <router-link to="/dashboard">Dashboard</router-link> |
    <router-link to="/admin">Admin</router-link> |
    <router-link to="/login">Login</router-link> |
    <button @click="logout">Logout</button>
  </div>
  <router-view />
</template>

<script>
export default {
  methods: {
    logout() {
      this.$store.dispatch("auth/logout");
      this.$router.push("login");
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
