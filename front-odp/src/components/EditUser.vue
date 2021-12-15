<template>
  <Form
    @submit="handleEditUser"
    :validation-schema="schema"
    :initial-values="user"
    class="w-96 mx-auto"
  >
    <label for="fullname" class="block font-medium text-gray-700 mt-3"
      >Fullname</label
    >
    <Field type="text" name="fullname" class="rounded-md w-full" />
    <ErrorMessage name="fullname" />
    <label for="username" class="block font-medium text-gray-700 mt-3"
      >Username</label
    >
    <Field type="text" name="username" class="rounded-md w-full" />
    <ErrorMessage name="username" class="text-red-500 text-sm block" />
    <label for="password" class="block font-medium text-gray-700 mt-3"
      >Password</label
    >
    <Field type="password" name="password" class="rounded-md w-full" />
    <ErrorMessage name="password" class="text-red-500 text-sm block" />

    <label for="password" class="block font-medium text-gray-700 mt-3"
      >Location</label
    >
    <vSelect
      v-model="selectedLocations"
      label="name"
      :options="locations"
      :multiple="true"
      :searchable="true"
      :filterable="true"
      :close-on-select="false"
      class="block w-full rounded-md"
    />

    <p v-if="message">{{ message }}</p>

    <Button type="submit" class="p-button-success block mt-6 w-full">
      Update
    </Button>
  </Form>
</template>
<script>
import vSelect from "vue-select";
import LocationService from "../services/location.service";
import UserService from "../services/user.service";
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
        .min(6, "Must be at leat 6 characters")
        .max(40, "Must be maximum 40 characters"),
    });
    return {
      loading: false,
      locations: [],
      selectedLocations: [],
      value: null,
      options: ["Batman", "Robin", "Joker"],
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
    handleEditUser(user) {
      console.log(user);
      console.log(this.selectedLocations);

      UserService.editUser({
        user: user,
        selectedLocations: this.selectedLocations,
      }).then(
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