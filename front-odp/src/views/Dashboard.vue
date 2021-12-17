<template>
  <div>
    <!-- <section>Dashboard ODP Pupuk NPK</section> -->
    <section>
      <div class="container mx-auto grid grid-cols-4 gap-2 mb-6">
        <div class="bg-white px-6 py-3 rounded-lg shadow-lg flex items-center">
          <div class="flex justify-center items-center mr-5">
            <i class="pi pi-clock bg-green-400 rounded-lg p-4 text-white"></i>
          </div>
          <div>
            <h2 class="font-bold text-gray-300">Waktu Saat Ini</h2>
            <span class="text-5xl font-bold">{{ currentTime }}</span>
          </div>
        </div>
        <div class="bg-white px-6 py-3 rounded-lg shadow-lg flex items-center">
          <Button
            class="p-button-success"
            label="refresh Data"
            @click="refreshData"
          />
        </div>
        <div class="bg-white px-6 py-3 rounded-lg shadow-lg flex items-center">
          <div class="flex justify-center items-center mr-5">
            <i class="pi pi-book bg-green-400 rounded-lg p-4 text-white"></i>
          </div>
          <div>
            <h2 class="font-bold text-gray-300">Total Transaksi</h2>
            <span class="text-4xl font-bold inline-block">
              {{ totalTransactions }}
            </span>
          </div>
        </div>
        <div class="bg-white px-6 py-3 rounded-lg shadow-lg flex items-center">
          <div class="flex justify-center items-center mr-5">
            <i class="pi pi-box bg-green-400 rounded-lg p-4 text-white"></i>
          </div>
          <div>
            <h2 class="font-bold text-gray-300">Total Penjualan</h2>
            <span class="text-4xl font-bold inline-block">
              {{ formatKilogram(totalSales || 0) }}
            </span>
          </div>
        </div>
      </div>
    </section>
    <section>
      <div class="container mx-auto grid grid-cols-3 gap-2">
        <div class="bg-white p-6 rounded-lg shadow-lg col-span-2">
          <h2>Grafik Penjualan</h2>
          <Chart
            ref="primeChart"
            type="line"
            :data="basicData"
            :options="basicOptions"
          />
        </div>

        <div class="bg-white p-6 rounded-lg shadow-lg row-span-2">
          <DataTable :value="allSales" :paginator="true" :rows="10" ref="dt">
            <template #header>
              <div class="table-header flex flex-column justify-between">
                <h5 class="font-bold text-xl">Penjualan Terbaru</h5>
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
              field="editedQuantity"
              header="Jumlah"
              :sortable="true"
              filterField="quantity"
            >
              <template #body="slotProps">
                {{ formatKilogram(slotProps.data.editedQuantity) }}
              </template>
            </Column>
            <template #empty> Belum ada penjualan. </template>
          </DataTable>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-lg col-span-2">
          <h2 class="text-2xl font-bold mb-6">Penjualan Terbanyak</h2>

          <div class="grid grid-cols-3 gap-2">
            <div
              class="flex justify-center items-center"
              v-for="(item, index) in salesRanking"
              v-bind:key="item.locationId"
            >
              <i
                class="pi pi-star bg-yellow-500 rounded-lg p-4 text-white mr-3"
                v-if="index === 0"
              >
              </i>
              <i
                class="pi pi-star bg-gray-400 rounded-lg p-4 text-white mr-3"
                v-if="index === 1"
              >
              </i>
              <i
                class="pi pi-star bg-yellow-900 rounded-lg p-4 text-white mr-3"
                v-if="index === 2"
              >
              </i>
              <div>
                <span class="block font-bold text-xl">
                  {{ item.name || null }}
                </span>
                <span class="text-xl">
                  {{ formatKilogram(item.sum) || null }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import SaleService from "../services/sale.service";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Chart from "primevue/chart";
import { useToast } from "vue-toastification";
import CustomToast from "../components/CustomToast.vue";

export default {
  name: "Dashboard",
  components: {
    DataTable,
    Column,
    Button,
    Chart,
  },
  data() {
    return {
      totalSales: 0,
      allSales: null,
      totalTransactions: 0,
      salesRanking: [],
      interval: null,
      currentTime: null,
    };
  },
  setup() {
    const basicData = {
      labels: ["0", "10", "20", "30", "40", "50", "60"],
      datasets: [
        {
          label: "Jumlah",
          data: [],
          fill: false,
          borderColor: "#0284c7",
          borderWidth: 8,
          tension: 0.4,
        },
        {
          label: "Jumlah Kumulatif",
          data: [],
          fill: false,
          borderColor: "#e11d48",
          borderWidth: 8,
          tension: 0.4,
        },
      ],
    };
    const basicOptions = {
      plugins: {
        legend: {
          labels: {
            color: "#495057",
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#495057",
          },
          grid: {
            color: "#ebedef",
          },
        },
        y: {
          ticks: {
            color: "#495057",
          },
          grid: {
            color: "#ebedef",
          },
        },
      },
    };

    const toast = useToast();

    return {
      basicData,
      basicOptions,
      toast,
    };
  },
  mounted() {
    this.updateTime();
    this.interval = setInterval(() => {
      this.updateTime();
    }, 1000);
    this.getAllSales();
    this.getSalesRanking();

    //BAD BAD BAD
    setTimeout(() => {
      this.getCummulativeSales();
    }, 1000);
  },
  methods: {
    getAllSales() {
      SaleService.getAllSalesForDashboard().then((res) => {
        this.allSales = res.data.rows;
        this.totalSales = res.data.sum;
        this.totalTransactions = res.data.count;
      });
    },
    getCummulativeSales() {
      SaleService.getCummulativeSalesForDashboard().then((res) => {
        let chart = this.$refs.primeChart.chart;

        chart.data.datasets[0].data = res.data.map(({ sum }) => sum);
        chart.data.datasets[1].data = res.data.map(
          ({ cummulative_sum }) => cummulative_sum
        );
        chart.data.labels = res.data.map(({ createdAt }) =>
          this.formatDate(createdAt)
        );
        chart.update();
      });
    },
    getSalesRanking() {
      SaleService.getSalesRanking().then((res) => {
        this.salesRanking = res.data;
      });
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
    refreshData() {
      this.getAllSales();
      this.getCummulativeSales();
    },
    updateTime() {
      this.currentTime = new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    },
  },
  sockets: {
    connect: function () {
      console.log("socket connected");
    },
    sale: function (data) {
      this.getAllSales();
      this.getCummulativeSales();

      this.toast({
        component: CustomToast,
        props: {
          quantity: data.editedQuantity,
          location: data.location.name,
        },
      });
    },
  },
  beforeUnmount() {
    // prevent memory leak
    clearInterval(this.interval);
  },
};
</script>