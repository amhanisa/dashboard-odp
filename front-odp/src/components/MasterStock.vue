<template>
  <div>
    <p>{{ content }}</p>
    <section>
      <div class="container mx-auto">
        <div class="flex justify-between mb-6">
          <div class="mb-6">
            <h2 class="text-3xl">Data Penjualan Pupuk NPK</h2>
          </div>
          <div class="bg-white p-5 rounded-lg shadow-lg text-right">
            <h2 class="text-gray-700">Total Penjualan</h2>
            <!-- <h3 class="text-3xl font-bold">{{ totalUserSales }}</h3> -->
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
          <DataTable
            :value="sales"
            :paginator="true"
            :rows="10"
            ref="dt"
            dataKey="id"
            v-model:filters="filters"
            filterDisplay="menu"
            :globalFilterFields="[
              'createdAt',
              'location.name',
              'user.fullname',
              'quantity',
              'editedQuantity',
              'status',
            ]"
          >
            <template #header>
              <div class="table-header flex flex-column justify-between">
                <h5 class="font-bold text-xl">Manage Sale</h5>
                <InputText
                  v-model="filters['global'].value"
                  placeholder="Keyword Search"
                />
              </div>
            </template>
            <Column field="createdAt" header="Waktu" :sortable="true">
              <template #body="slotProps">
                {{ formatDate(slotProps.data.createdAt) }}
              </template>
            </Column>
            <Column
              field="location.name"
              header="Lokasi"
              filterField="location.name"
              :sortable="true"
            >
              <template #filter="{ filterModel }">
                <InputText
                  type="text"
                  v-model="filterModel.value"
                  class="p-column-filter"
                  placeholder="Search by location"
                />
              </template>
            </Column>
            <Column field="user.fullname" header="User" :sortable="true">
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
            <Column
              field="editedQuantity"
              header="Jumlah Perbaikan"
              :sortable="true"
              filterField="editedQuantity"
            >
              <template #body="slotProps">
                {{ formatKilogram(slotProps.data.editedQuantity) }}
              </template>
            </Column>
            <Column field="status" header="Status">
              <template #body="slotProps">
                <span
                  class="
                    inline-flex
                    items-center
                    justify-center
                    px-2
                    py-1
                    text-xs
                    font-bold
                    leading-none
                    text-white
                    rounded
                  "
                  v-bind:class="{
                    'bg-green-500': slotProps.data.status,
                    'bg-red-500': !slotProps.data.status,
                  }"
                >
                  {{ slotProps.data.status ? "CONFIRMED" : "WAITING" }}
                </span>
              </template>
            </Column>
            <Column :exportable="false" style="min-width: 8rem">
              <template #body="slotProps">
                <Button
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-success mr-2"
                  @click="openModalEditSale(slotProps.data)"
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
        </div>
        <ErrorMessage name="quantity" class="text-red-500 text-sm block" />
        <label
          for="editedQuantity"
          class="block text-sm font-medium text-gray-700 mt-3"
        >
          Quantity Updated
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
          <Field type="number" name="editedQuantity" class="pr-10 rounded-md" />
        </div>
        <ErrorMessage
          name="editedQuantity"
          class="text-red-500 text-sm block"
        />

        <Divider />

        <Field name="user" v-model="newSale.user" hidden></Field>
        <div>
          <label
            for="user"
            class="block text-sm font-medium text-gray-700 mt-3"
          >
            User
          </label>
          <vSelect
            v-model="newSale.user"
            label="fullname"
            :options="users"
            :searchable="true"
            :filterable="true"
            class="block w-full rounded-md"
          />
        </div>
        <ErrorMessage name="user" class="text-red-500 text-sm block" />

        <Field name="location" v-model="newSale.location" hidden></Field>
        <div>
          <label
            for="quantity"
            class="block text-sm font-medium text-gray-700 mt-3"
          >
            Location
          </label>
          <vSelect
            v-model="newSale.location"
            label="name"
            :options="locations"
            :searchable="true"
            :filterable="true"
            class="block w-full rounded-md"
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

    <Dialog header="Ubah Penjualan" v-model:visible="showModalEditSale">
      <Form
        id="editSale"
        @submit="handleEditSale"
        :validation-schema="schema"
        v-slot="{ isSubmitting }"
        :initial-values="selectedSale"
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
          <Field
            type="number"
            name="quantity"
            class="pr-10 rounded-md"
            disabled
          />
        </div>
        <ErrorMessage name="quantity" class="text-red-500 text-sm block" />
        <label
          for="editedQuantity"
          class="block text-sm font-medium text-gray-700 mt-3"
        >
          Quantity Updated
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
          <Field type="number" name="editedQuantity" class="pr-10 rounded-md" />
        </div>
        <ErrorMessage
          name="editedQuantity"
          class="text-red-500 text-sm block"
        />

        <Divider />

        <Field name="user" v-model="selectedSale.user" hidden></Field>
        <div>
          <label
            for="user"
            class="block text-sm font-medium text-gray-700 mt-3"
          >
            User
          </label>
          <vSelect
            v-model="selectedSale.user"
            label="fullname"
            :options="users"
            :searchable="true"
            :filterable="true"
            class="block w-full rounded-md"
          />
        </div>
        <ErrorMessage name="user" class="text-red-500 text-sm block" />

        <Field name="location" v-model="selectedSale.location" hidden></Field>
        <div>
          <label
            for="quantity"
            class="block text-sm font-medium text-gray-700 mt-3"
          >
            Location
          </label>
          <vSelect
            v-model="selectedSale.location"
            label="name"
            :options="locations"
            :searchable="true"
            :filterable="true"
            class="block w-full rounded-md"
          />
        </div>
        <ErrorMessage name="location" class="text-red-500 text-sm block" />

        <Button
          :disabled="isSubmitting"
          form="editSale"
          type="submit"
          class="p-button-success mt-6"
        >
          Save
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
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { FilterMatchMode, FilterOperator } from "primevue/api";
import { mapGetters } from "vuex";
import { useToast } from "vue-toastification";

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
    Divider,
    vSelect,
    Form,
    Field,
    ErrorMessage,
  },
  setup() {
    const toast = useToast();

    return { toast };
  },
  data() {
    const schema = yup.object().shape({
      quantity: yup.number().required("Mohon isi jumlah").min(1),
      editedQuantity: yup.number().required("Mohon isi jumlah").min(1),
      user: yup
        .object("")
        .required("Mohon isi user")
        .typeError("Mohon isi user"),
      location: yup
        .object("")
        .required("Mohon isi lokasi")
        .typeError("Mohon isi lokasi"),
    });

    return {
      sales: null,
      showModalAddSale: false,
      showModalEditSale: false,
      selectedSale: null,
      newSale: { user: null, location: null },
      content: "",
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        "location.name": {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          ],
        },
      },
      schema,
    };
  },
  computed: {
    ...mapGetters(["users", "locations"]),
  },
  mounted() {
    this.getAllUser();
    this.getAllLocation();
    this.getAllSales();
  },
  methods: {
    getAllUser() {
      this.$store.dispatch("refreshUsers");
    },
    getAllLocation() {
      this.$store.dispatch("refreshLocations");
    },
    getAllSales() {
      SaleService.getAllSales().then(
        (response) => {
          this.sales = response.data.rows;
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
      SaleService.addSaleFromAdmin({
        quantity: formValue.quantity,
        editedQuantity: formValue.editedQuantity,
        location: this.newSale.location,
        user: this.newSale.user,
      }).then(
        () => {
          this.showModalAddSale = false;
          this.newSale.location = null;
          this.newSale.user = null;
          resetForm();
          this.getAllSales();
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
    openModalEditSale(sale) {
      this.selectedSale = { ...sale };
      this.showModalEditSale = true;
    },
    closeModalEditSale() {
      this.showModalEditSale = false;
    },
    handleEditSale(formValue, { resetForm }) {
      SaleService.updateSaleValue({
        id: this.selectedSale.id,
        quantity: formValue.quantity,
        editedQuantity: formValue.editedQuantity,
        selectedLocation: this.selectedSale.location,
        selectedUser: this.selectedSale.user,
      }).then(
        () => {
          this.showModalEditSale = false;
          this.selectedLocation = null;
          resetForm();
          this.getAllSales();
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
            .then(() => {
              this.getAllSales();
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
  sockets: {
    connect: function () {
      console.log("socket connected");
    },
    newSale: function () {
      this.getAllSales();
      this.toast("Wuuhuuu");
    },
  },
};
</script>
