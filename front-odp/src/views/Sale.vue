<template>
  <div>
    <h1>This is an about page</h1>
    <p>{{ content }}</p>
    <section>
      <h3>
        <strong>{{ currentUser.fullname }}</strong> Profile
      </h3>
      <p>
        <strong>username:</strong>
        {{ currentUser.username }}
      </p>
    </section>

    <section>
      <div class="container mx-auto">
        <h2>Data Penjualan Pupuk NPK</h2>
        <button
          class="
            bg-greenpkc
            px-6
            py-2
            rounded-md
            text-white
            hover:bg-green-500
            focus:ring
          "
          @click="openModalAddSale"
        >
          Tambah Penjualan
        </button>
        <div>
          <DataTable :value="userSales" :paginator="true" :rows="10">
            <Column field="quantity" header="Quantity"></Column>
            <Column field="createdAt" header="Timestamp"></Column>
          </DataTable>
        </div>
      </div>
    </section>

    <Modal v-show="showModalAddSale" @close="closeModalAddSale">
      <template v-slot:header>Add Sale</template>
      <template v-slot:body>
        <Form
          id="addSale"
          @submit="handleAddSale"
          :validation-schema="schema"
          v-slot="{ isSubmitting }"
        >
          <label for="quantity" class="block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <div class="relative">
            <div
              class="
                absolute
                h-full
                right-0
                pr-3
                flex
                items-center
                pointer-events-none
              "
            >
              <span class="text-gray-500 sm:text-sm"> KG </span>
            </div>
            <Field type="number" name="quantity" class="pr-10 rounded-md" />
          </div>
          <ErrorMessage name="quantity" class="text-red-500 text-sm block" />

          <button
            :disabled="isSubmitting"
            form="addSale"
            class="
              px-6
              py-2
              bg-greenpkc
              text-white
              rounded-md
              disabled:bg-yellowpkc
            "
          >
            Add
            <Spinner v-if="isSubmitting" />
          </button>
        </Form>
      </template>
      <template v-slot:footer> </template>
    </Modal>
    <Dialog header="Header"></Dialog>
  </div>
</template>

<script>
import SaleService from "../services/sale.service";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Dialog from "primevue/dialog";
import Modal from "../components/Modal.vue";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

export default {
  name: "Sale",
  components: {
    DataTable,
    Column,
    Dialog,
    Modal,
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const schema = yup.object().shape({
      quantity: yup.number().required("Quantity required"),
    });

    return {
      userSales: null,
      showModalAddSale: false,
      content: "",
      schema,
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  mounted() {
    SaleService.getUserSales().then(
      (response) => {
        this.userSales = response.data;
      },
      (error) => {
        this.content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
      }
    );
  },
  methods: {
    openModalAddSale() {
      this.showModalAddSale = true;
    },
    closeModalAddSale() {
      this.showModalAddSale = false;
    },
    handleAddSale(quantity, { resetForm }) {
      this.isLoading = true;
      SaleService.addSale(quantity).then(
        (res) => {
          console.log(res);
          this.showModalAddSale = false;
          resetForm();
        },
        (error) => {
          this.content =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        }
      );
    },
    // server() {
    //   return SaleService.getUserSales().then(
    //     (response) => {
    //       return response.data;
    //     },
    //     (error) => {
    //       this.content =
    //         (error.response &&
    //           error.response.data &&
    //           error.response.data.message) ||
    //         error.message ||
    //         error.toString();
    //     }
    //   );
    // },
  },
};
</script>
