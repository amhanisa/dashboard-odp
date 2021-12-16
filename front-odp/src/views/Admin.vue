<template>
  <div>
    <section>
      <div class="container mx-auto grid grid-cols-3 gap-2">
        <div class="bg-white rounded-xl shadow-xl p-6 col-span-2">
          <DataTable :value="users" :paginator="true" :rows="10">
            <template #header>
              <div class="table-header flex flex-column justify-between">
                <h5 class="font-bold text-xl">Daftar User</h5>
                <div>
                  <span class="p-input-icon-left">
                    <i class="pi pi-search" />
                  </span>
                  <Button
                    @click="openModalAddUser"
                    class="p-button-primary"
                    label="Tambah User"
                  />
                </div>
              </div>
            </template>
            <Column field="fullname" header="Nama"></Column>
            <Column field="username" header="Username"></Column>
            <Column field="user.locations" header="Lokasi">
              <template #body="slotProps">
                <span
                  v-for="location in slotProps.data.locations"
                  v-bind:key="location.id"
                  >{{ location.name }} |
                </span>
              </template>
            </Column>
            <Column :exportable="false" style="min-width: 8rem">
              <template #body="slotProps">
                <Button
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-success mr-2"
                  @click="openModalEditUser(slotProps.data)"
                />
                <Button
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-danger"
                  @click="confirmDeleteUser(slotProps.data)"
                />
              </template>
            </Column>
            <template #empty> Belum ada user. </template>
          </DataTable>
        </div>

        <div class="bg-white rounded-xl shadow-xl p-6">
          <DataTable :value="locations" :paginator="true" :rows="10">
            <template #header>
              <div class="table-header flex flex-column justify-between">
                <h5 class="font-bold text-xl">Daftar Lokasi</h5>
                <div>
                  <span class="p-input-icon-left">
                    <i class="pi pi-search" />
                  </span>
                  <Button
                    @click="openModalAddLocation"
                    class="p-button-primary"
                    label="Tambah Lokasi"
                  />
                </div>
              </div>
            </template>
            <Column field="name" header="Nama Lokasi"></Column>
            <Column :exportable="false" style="min-width: 8rem">
              <template #body="slotProps">
                <Button
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-success mr-2"
                  @click="openModalEditLocation(slotProps.data)"
                />
                <Button
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-danger"
                  @click="confirmDeleteLocation(slotProps.data)"
                />
              </template>
            </Column>
            <template #empty> Belum ada lokasi. </template>
          </DataTable>
        </div>
      </div>
    </section>

    <Dialog header="Tambah User" v-model:visible="showModalAddUser">
      <Register />
    </Dialog>

    <Dialog
      header="Edit User"
      v-model:visible="showModalEditUser"
      :maximizable="true"
    >
      <EditUser :user="selectedUser" />
    </Dialog>

    <Dialog header="Tambah Lokasi" v-model:visible="showModalAddLocation">
      <Form
        id="addSale"
        @submit="handleAddLocation"
        :validation-schema="schema"
        v-slot="{ isSubmitting }"
      >
        <label for="name" class="block text-sm font-medium text-gray-700">
          Nama Lokasi
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
          ></div>
          <Field type="text" name="name" class="pr-10 rounded-md" />
        </div>
        <ErrorMessage name="name" class="text-red-500 text-sm block" />

        <Button
          :disabled="isSubmitting"
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

    <Dialog header="Ubah Lokasi" v-model:visible="showModalEditLocation">
      <Form
        id="editSale"
        @submit="handleEditLocation"
        :validation-schema="schema"
        :initial-values="selectedLocation"
        v-slot="{ isSubmitting }"
      >
        <label for="name" class="block text-sm font-medium text-gray-700">
          Nama Lokasi
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
          ></div>
          <Field type="text" name="name" class="pr-10 rounded-md" />
        </div>
        <ErrorMessage name="name" class="text-red-500 text-sm block" />

        <Button
          :disabled="isSubmitting"
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
import UserService from "../services/user.service";
import LocationService from "../services/location.service";
import { mapGetters } from "vuex";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ConfirmDialog from "primevue/confirmdialog";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import Register from "../components/Register.vue";
import EditUser from "../components/EditUser.vue";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

export default {
  name: "Admin",
  components: {
    DataTable,
    Column,
    Dialog,
    ConfirmDialog,
    Button,
    Register,
    EditUser,
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const schema = yup.object().shape({
      name: yup.string().required("Name required"),
    });
    return {
      users: [],
      showModalAddUser: false,
      showModalEditUser: false,
      showModalAddLocation: false,
      showModalEditLocation: false,
      selectedLocation: null,
      selectedUser: null,
      schema,
    };
  },
  mounted() {
    this.getAllUsers();
    this.$store.dispatch("refreshLocations");
  },
  computed: {
    ...mapGetters(["locations"]),
  },
  methods: {
    getAllUsers() {
      UserService.getAllUsers().then((res) => (this.users = res.data));
    },
    getAllLocations() {
      this.$store.dispatch("refreshLocations");
    },
    openModalAddUser() {
      this.showModalAddUser = true;
    },
    openModalEditUser(user) {
      this.selectedUser = user;
      this.showModalEditUser = true;
    },
    openModalAddLocation() {
      this.showModalAddLocation = true;
    },
    openModalEditLocation(location) {
      this.selectedLocation = location;
      this.showModalEditLocation = true;
    },
    handleAddLocation(name, { resetForm }) {
      LocationService.addLocation(name).then(
        (res) => {
          console.log(res);
          this.showModalAddLocation = false;
          resetForm();
          this.getAllLocations();
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
    handleEditLocation({ name }, { resetForm }) {
      LocationService.editLocation({
        id: this.selectedLocation.id,
        name: name,
      }).then(
        (res) => {
          console.log(res);
          this.showModalEditLocation = false;
          resetForm();
          this.getAllLocations();
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
    confirmDeleteLocation(data) {
      this.$confirm.require({
        message: `Apa anda yakin menghapus lokasi ${data.name}?`,
        header: "Konfirmasi",
        icon: "pi pi-exclamation-triangle",
        acceptLabel: "Ya",
        rejectLabel: "Batal",
        acceptClass: "p-button-success",
        rejectClass: "p-button-success p-button-text",
        accept: () => {
          LocationService.deleteLocation(data)
            .then((res) => {
              console.log(res);
              this.getAllLocations();
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
  },
};
</script>