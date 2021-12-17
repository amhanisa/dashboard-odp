<template>
  <div>
    <p>{{ content }}</p>
    <section>
      <div class="container mx-auto">
        <section>
          <div
            class="
              container
              mx-auto
              grid grid-rows-1
              sm:grid-cols-4
              gap-2
              mb-6
              p-6
              md:p-0
            "
          >
            <div class="sm:col-span-2 lg:col-span-3">
              <span class="text-4xl font-bold">
                Hi, {{ currentUser.fullname }}!
              </span>
              <Button
                label="Keluar"
                icon="pi pi-sign-out"
                class="block mt-3 p-button-sm p-button-outlined p-button-danger"
              />
              <Divider class="sm:invisible" />
            </div>
            <div
              class="
                sm:col-span-2
                lg:col-span-1
                bg-white
                px-6
                py-3
                rounded-lg
                shadow-lg
                flex
                items-center
              "
            >
              <div class="flex justify-center items-center mr-5">
                <i class="pi pi-box bg-green-400 rounded-lg p-4 text-white"></i>
              </div>
              <div>
                <h2 class="font-bold text-gray-300">Total Penjualan</h2>
                <span class="text-4xl font-bold inline-block">
                  {{ formatKilogram(totalUserSales) }}
                </span>
              </div>
            </div>
          </div>
        </section>

        <div class="bg-white rounded-lg shadow-lg p-5">
          <Toolbar class="p-mb-4">
            <template #start>
              <Button
                label="Tambah Penjualan"
                icon="pi pi-plus"
                class="p-button-success p-mr-2 mr-3"
                @click="openModalAddSale"
              />
            </template>

            <template #end>
              <Button
                label="Export"
                icon="pi pi-upload"
                class="p-button-help hidden md:block"
                @click="exportCSV($event)"
              />
            </template>
          </Toolbar>
          <DataTable
            :value="userSales"
            :paginator="true"
            :rows="10"
            ref="dt"
            dataKey="id"
            v-model:filters="filters"
            :globalFilterFields="['createdAt', 'location.name', 'quantity']"
          >
            <template #header>
              <div
                class="
                  table-header
                  flex flex-column
                  justify-between
                  items-center
                "
              >
                <h5 class="font-bold text-xl">Manage Sale</h5>
                <InputText
                  v-model="filters['global'].value"
                  placeholder="Cari Data"
                />
              </div>
            </template>
            <Column field="createdAt" header="Waktu" :sortable="true">
              <template #body="slotProps">
                {{ formatDate(slotProps.data.createdAt) }}
              </template>
            </Column>
            <Column field="location.name" header="Lokasi" :sortable="true">
            </Column>
            <Column
              field="quantity"
              header="Jumlah"
              :sortable="true"
              filterField="quantity"
            >
              <template #body="slotProps">
                {{ formatKilogram(slotProps.data.quantity) }}
              </template>
            </Column>
            <Column :exportable="false" style="min-width: 8rem">
              <template #body="slotProps">
                <!-- <Button
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-success mr-2"
                  @click="editSale(slotProps.data)"
                /> -->
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

    <Dialog
      header="Tambah Penjualan"
      v-model:visible="showModalAddSale"
      :maximizable="true"
    >
      <Form
        id="addSale"
        @submit="handleAddSale"
        :validation-schema="schema"
        v-slot="{ isSubmitting }"
        autocomplete="off"
        class="w-96 mx-auto"
      >
        <label for="quantity" class="block text-sm font-medium text-gray-700">
          Jumlah
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
          <Field type="number" name="quantity" class="w-96 pr-10 rounded-md" />
        </div>
        <ErrorMessage name="quantity" class="text-red-500 text-sm block" />

        <Field name="location" v-model="selectedLocation" hidden></Field>

        <div>
          <label
            for="quantity"
            class="block text-sm font-medium text-gray-700 mt-3"
          >
            Lokasi
          </label>
          <vSelect
            v-model="selectedLocation"
            label="name"
            :options="currentUserLocations"
            :searchable="true"
            :filterable="true"
            class="block w-full rounded-md"
            placeholder="Cari Lokasi..."
          />
        </div>
        <ErrorMessage name="location" class="text-red-500 text-sm block" />

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
import Divider from "primevue/divider";
import { FilterMatchMode } from "primevue/api";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { mapGetters } from "vuex";

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
    Divider,
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const schema = yup.object().shape({
      quantity: yup
        .number()
        .min(1, "Mohon isi diatas 1 kg")
        .required("Mohon isi jumlah")
        .typeError("Mohon isi jumlah"),
      location: yup
        .object("")
        .required("Location required")
        .typeError("Mohon isi lokasi"),
    });

    return {
      userSales: null,
      showModalAddSale: false,
      selectedLocation: null,
      content: "",
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      },
      schema,
    };
  },
  computed: {
    ...mapGetters(["currentUserLocations"]),

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
    this.getCurrentUserLocation();
    this.getUserSales();
  },
  methods: {
    getCurrentUserLocation() {
      this.$store.dispatch("refreshCurrentUserLocations");
    },
    getUserSales() {
      SaleService.getUserSales().then(
        (response) => {
          console.log(response.data);
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
    handleAddSale(formValue, { resetForm }) {
      SaleService.addSale({
        quantity: formValue.quantity,
        selectedLocation: this.selectedLocation,
      }).then(
        () => {
          this.showModalAddSale = false;
          this.selectedLocation = null;
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

      const formatted = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      return formatted;
    },
    formatKilogram(value) {
      return value.toLocaleString("id-ID", {
        style: "unit",
        unit: "kilogram",
      });
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
