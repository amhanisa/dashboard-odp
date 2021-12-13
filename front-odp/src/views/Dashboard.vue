<template>
  <div>
    <section>Dashboard ODP Pupuk NPK</section>
    <section>
      <h3>
        <strong>{{ currentUser.fullname }}</strong> Profile
      </h3>
      <p>
        <strong>Token:</strong>
        {{ currentUser.accessToken.substring(0, 20) }} ...
        {{
          currentUser.accessToken.substr(currentUser.accessToken.length - 20)
        }}
      </p>
      <p>
        <strong>Id:</strong>
        {{ currentUser.id }}
      </p>
      <p>
        <strong>username:</strong>
        {{ currentUser.username }}
      </p>
    </section>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
};
</script>