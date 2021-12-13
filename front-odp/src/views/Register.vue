<template>
  <section class="container mx-auto">
    <div>
      Register New User
      <form @submit.prevent="registerUser">
        <label for="fullname" class="block font-medium text-gray-700"
          >Fullname</label
        >
        <input
          v-model="this.fullname"
          type="text"
          name="fullname"
          id="fullname"
          class="rounded-md mb-3"
        />
        <label for="username" class="block font-medium text-gray-700"
          >Username</label
        >
        <input
          v-model="this.username"
          type="text"
          name="username"
          id="username"
          class="rounded-md mb-3"
        />
        <label for="password" class="block font-medium text-gray-700"
          >Password</label
        >
        <input
          v-model="this.password"
          type="password"
          name="password"
          id="password"
          class="rounded-md mb-3"
        />
        <button
          type="submit"
          class="block bg-greenpkc px-8 py-2 rounded-md text-white font-bold"
        >
          Register
        </button>
      </form>
    </div>
  </section>
</template>
<script>
import axios from "axios";
import CONFIG from "../config/config";

export default {
  data() {
    return {
      fullname: "",
      username: "",
      password: "",
    };
  },
  methods: {
    registerUser() {
      console.log(this.username, this.password);
      axios
        .post(`${CONFIG.API_URL}/register`, {
          fullname: this.fullname,
          username: this.username,
          password: this.password,
        })
        .then((res) => console.log(res));
    },
  },
};
</script>