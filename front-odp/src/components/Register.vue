<template>
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

    <Button type="submit" class="p-button-success block mt-6 w-full">
      Register
    </Button>
  </Form>
</template>
<script>
import Button from "primevue/button";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

export default {
  name: "Register",
  components: {
    Button,
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
      message: "",
      schema,
    };
  },
  methods: {
    handleRegister(user) {
      this.message = "";

      this.$store.dispatch("auth/register", user).then(
        (data) => {
          this.message = data.message;
          this.$store.dispatch("refreshUsers");
        },
        (error) => {
          this.message =
            (error.response &&
              error.response.data & error.response.data.message) ||
            error.message ||
            error.toString();
        }
      );
    },
  },
};
</script>