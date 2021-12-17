<template>
  <div class="flex flex-col items-center justify-center w-full h-full">
    <img src="../../public/odp.png" class="w-96" alt="Logo ODP" />
    <Button
      label="login"
      @click="login"
      icon="pi pi-sign-in"
      class="p-button-success"
    />
  </div>
</template>

<script>
import Button from "primevue/button";

export default {
  name: "Home",
  components: {
    Button,
  },
  methods: {
    login() {
      this.$router.push("/login");
    },
  },
};
</script>
