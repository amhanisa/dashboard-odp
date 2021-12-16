<template>
  <div>
    <p>{{ content }}</p>
    <section>
      <div class="container mx-auto">
        <div class="flex justify-between mb-6">
          <div class="mb-6">
            <h2 class="text-3xl">Data Penjualan Pupuk NPK</h2>
            <h2 class="text-3xl">{{ currentUser.fullname }}</h2>
          </div>
          <div class="bg-white p-5 rounded-lg shadow-lg text-right">
            <h2 class="text-gray-700">Total Penjualan</h2>
            <h3 class="text-3xl font-bold">{{ totalUserSales }}</h3>
            <small class="text-gray-700">Kg</small>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-lg p-5">
          <Toolbar class="p-mb-4">
            <template #start>
              <Button
                label="Tambah Penjualan"
                icon="pi pi-plus"
                class="p-button-success p-mr-2 mr-3"
                @click="openModalAddSale"
              />
              <Button
                label="Delete (Blum Bisa)"
                icon="pi pi-trash"
                class="p-button-danger"
              />
              <!-- @click="confirmDeleteSelected"
                :disabled="!selectedProducts || !selectedProducts.length" -->
            </template>

            <template #end>
              <Button
                label="Export"
                icon="pi pi-upload"
                class="p-button-help"
                @click="exportCSV($event)"
              />
            </template>
          </Toolbar>
          <DataTable :value="userSales" :paginator="true" :rows="10" ref="dt">
            <template #header>
              <div class="table-header flex flex-column justify-between">
                <h5 class="font-bold text-xl">Manage Products</h5>
                <span class="p-input-icon-left">
                  <i class="pi pi-search" />
                  <InputText
                    v-model="filters['global'].value"
                    placeholder="Keyword Search"
                  />
                </span>
              </div>
            </template>
            <Column field="createdAt" header="Waktu" :sortable="true">
              <template #body="slotProps">
                {{ formatDate(slotProps.data.createdAt) }}
              </template>
            </Column>
            <Column
              field="quantity"
              header="Jumlah"
              :sortable="true"
              filterField="quantity"
            >
            </Column>
            <Column :exportable="false" style="min-width: 8rem">
              <template #body="slotProps">
                <Button
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-success mr-2"
                  @click="editSale(slotProps.data)"
                />
                <Button
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-danger"
                  @click="confirmDeleteSale(slotProps.data)"
                />
              </template>
            </Column>
            <template #empty> Belum ada penjualan. </template>
          </DataTable>
        </div>
      </div>
    </section>

    <Dialog header="Tambah Penjualan" v-model:visible="showModalAddSale">
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
        </div>
        <ErrorMessage name="quantity" class="text-red-500 text-sm block" />

        <Button
          :disabled="isSubmitting"
          form="addSale"
          type="submit"
          class="p-button-success mt-6"
        >
          Add
          <i
            class="pi pi-spin pi-spinner"
            style="fontsize: 1em"
            v-if="isSubmitting"
          ></i>
        </Button>
      </Form>
    </Dialog>

    <ConfirmDialog></ConfirmDialog>
  </div>
</template>

<script>
import SaleService from "../services/sale.service";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Dialog from "primevue/dialog";
import ConfirmDialog from "primevue/confirmdialog";
import Button from "primevue/button";
import Toolbar from "primevue/toolbar";
import InputText from "primevue/inputtext";
import vSelect from "vue-select";
import { FilterMatchMode } from "primevue/api";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

export default {
  name: "Sale",
  components: {
    DataTable,
    Column,
    Dialog,
    ConfirmDialog,
    Button,
    Toolbar,
    InputText,
    vSelect,
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
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        quantity: { value: null, matchMode: FilterMatchMode.EQUALS },
      },
      schema,
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    totalUserSales() {
      let total = 0;
      if (this.userSales !== null) {
        this.userSales.forEach((sale) => {
          total += sale.quantity;
        });
      }
      return total;
    },
  },
  mounted() {
    this.getUserSales();
  },
  methods: {
    getUserSales() {
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
          this.getUserSales();
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
    formatDate(value) {
      const date = new Date(value);

      const formatted = date.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "2-digit",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      return formatted;
    },
    editSale(data) {
      console.log(data);
    },
    confirmDeleteSale(data) {
      console.log(data);
      this.$confirm.require({
        message: `Apa anda yakin menghapus penjualan ${data.quantity} Kg?`,
        header: "Konfirmasi",
        icon: "pi pi-exclamation-triangle",
        acceptLabel: "Ya",
        rejectLabel: "Batal",
        acceptClass: "p-button-success",
        rejectClass: "p-button-success p-button-text",
        accept: () => {
          SaleService.deleteUserSale(data)
            .then((res) => {
              console.log(res);
              this.getUserSales();
            })
            .catch(() => {
              alert("error");
            });
        },
        reject: () => {
          //callback to execute when user rejects the action
        },
      });
    },
    exportCSV() {
      this.$refs.dt.exportCSV();
    },
  },
};
</script>
