<template>
  <div class="w-min p-6 shadow-lg mx-auto">
    <h1 class="text-center font-bold mb-3 text-gray-700">Login ODP 2021</h1>
    <Form @submit="handleLogin" :validation-schema="schema">
      <label for="username" class="block font-medium text-gray-700 mt-3"
        >Username</label
      >
      <Field type="text" name="username" class="rounded-md" />
      <ErrorMessage name="username" class="text-red-500 text-sm block" />
      <label for="password" class="block font-medium text-gray-700 mt-3"
        >Password</label
      >
      <Field type="password" name="password" class="rounded-md" />
      <ErrorMessage name="username" class="text-red-500 text-sm block" />
      <button
        type="submit"
        class="
          block
          w-full
          bg-greenpkc
          px-8
          py-2
          mt-3
          rounded-md
          text-white
          font-bold
        "
      >
        Login
      </button>
      <p v-if="message">{{ message }}</p>
    </Form>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

export default {
  name: "Login",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const schema = yup.object().shape({
      username: yup.string().required("Username is required"),
      password: yup.string().required("Password is required"),
    });

    return {
      loading: false,
      message: "",
      schema,
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  created() {
    if (this.loggedIn) {
      this.$router.push("/sale");
    }
  },
  methods: {
    handleLogin(user) {
      console.log(user);
      this.loading = true;

      this.$store.dispatch("auth/login", user).then(
        () => {
          this.$router.push("/sale");
        },
        (error) => {
          this.loading = false;
          this.message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        }
      );
    },
  },
};
</script>