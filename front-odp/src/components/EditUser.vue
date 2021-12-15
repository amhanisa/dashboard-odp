<template>
  <Form
    @submit="handleRegister"
    :validation-schema="schema"
    :initial-values="user"
  >
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

    <label for="password" class="block font-medium text-gray-700 mt-3"
      >Location</label
    >
    <vSelect v-model="selectedCars" :options="options" class="block" />

    <p v-if="message">{{ message }}</p>

    <Button type="submit" class="p-button-success block mt-6 w-full">
      Update
    </Button>
  </Form>
</template>
<script>
import vSelect from "vue-select";
import LocationService from "../services/location.service";
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
    vSelect,
  },
  props: ["user"],
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
      locations: [],
      selectedLocations: [],
      value: null,
      options: ["Batman", "Robin", "Joker"],
      selectedCars: null,
      cars: [
        { brand: "Audi", value: "Audi" },
        { brand: "BMW", value: "BMW" },
        { brand: "Fiat", value: "Fiat" },
        { brand: "Honda", value: "Honda" },
        { brand: "Jaguar", value: "Jaguar" },
        { brand: "Mercedes", value: "Mercedes" },
        { brand: "Renault", value: "Renault" },
        { brand: "Volkswagen", value: "Volkswagen" },
        { brand: "Volvo", value: "Volvo" },
      ],
      message: "",
      schema,
    };
  },
  mounted() {
    this.getAllLocations();
  },
  methods: {
    getAllLocations() {
      LocationService.getAllLocations().then(
        (res) => (this.locations = res.data)
      );
    },
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