<template>
  <section class="container mx-auto">
    <div class="w-min p-6 shadow-lg mx-auto">
      <h1 class="text-center font-bold mb-3 text-gray-700">
        Register New User
      </h1>
      <Form @submit="handleRegister" :validation-schema="schema">
        <label for="fullname" class="block font-medium text-gray-700 mt-3"
          >Fullname</label
        >
        <Field type="text" name="fullname" class="rounded-md" />
        <ErrorMessage name="fullname" />
        <label for="username" class="block font-medium text-gray-700 mt-3"
          >Username</label
        >
        <Field type="text" name="username" class="rounded-md" />
        <ErrorMessage name="username" class="text-red-500 text-sm block" />
        <label for="password" class="block font-medium text-gray-700 mt-3"
          >Password</label
        >
        <Field type="password" name="password" class="rounded-md" />
        <ErrorMessage name="password" class="text-red-500 text-sm block" />

        <p v-if="message">{{ message }}</p>

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
          Register
        </button>
      </Form>
    </div>
  </section>
</template>
<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

export default {
  name: "Register",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const schema = yup.object().shape({
      fullname: yup
        .string()
        .required("Fullname is required")
        .max(50, "Must be maximum 50 characters"),
      username: yup
        .string()
        .required("Username is required")
        .min(3, "Must be at least 3 characters")
        .max(20, "Must be maximum 20 characters"),
      password: yup
        .string()
        .required("Password is required")
        .min(6, "Must be at leat 6 characters")
        .max(40, "Must be maximum 40 characters"),
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
      return this.$router.push("/dashboard");
    }
  },
  methods: {
    handleRegister(user) {
      this.message = "";
      this.loading = true;

      this.$store.dispatch("auth/register", user).then(
        (data) => {
          this.message = data.message;
          this.loading = false;
        },
        (error) => {
          this.message =
            (error.response &&
              error.response.data & error.response.data.message) ||
            error.message ||
            error.toString();
          this.loading = false;
        }
      );
    },
  },
};
</script>