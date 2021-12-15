<template>
  <div>
    <!-- <section>Dashboard ODP Pupuk NPK</section> -->
    <section>
      <div class="container mx-auto grid grid-cols-4 gap-2 mb-6">
        <div class="bg-white px-6 py-3 rounded-lg shadow-lg">
          <h2 class="font-bold text-gray-300">Waktu Saat Ini</h2>
          <span class="text-5xl font-bold">{{ currentTime }}</span>
        </div>
        <div class="bg-white px-6 py-3 rounded-lg shadow-lg">
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
            <i class="pi pi-dollar bg-green-400 rounded-lg p-4 text-white"></i>
          </div>
          <div>
            <h2 class="font-bold text-gray-300">Total Penjualan</h2>
            <span class="text-4xl font-bold inline-block">
              {{ formatTotalSales(totalSales) }}
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
          <LineChart />
        </div>
        <div class="bg-white p-6 rounded-lg shadow-lg">
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
            <Column field="user.fullname" header="Perusahaan" :sortable="true">
            </Column>
            <Column
              field="quantity"
              header="Jumlah"
              :sortable="true"
              filterField="quantity"
            >
            </Column>
            <template #empty> Belum ada penjualan. </template>
          </DataTable>
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
      sumSales: [],
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
          borderColor: "#42A5F5",
          tension: 0.4,
        },
        {
          label: "Jumlah Kumulatif",
          data: [],
          fill: false,
          borderColor: "#42A5F5",
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

    return {
      basicData,
      basicOptions,
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  mounted() {
    this.updateTime();
    this.interval = setInterval(() => {
      this.updateTime();
    }, 1000);

    this.getTotalSales();
    this.getAllSales();

    //BAD BAD BAD
    setTimeout(() => {
      this.getCummulativeSales();
    }, 1000);
  },
  methods: {
    getTotalSales() {
      SaleService.getTotalSales()
        .then((res) => {
          this.totalSales = res.data.total;
        })
        .catch((err) => console.log(err));
    },
    getAllSales() {
      SaleService.getAllSales().then((res) => {
        this.allSales = res.data.rows;
        this.totalTransactions = res.data.count;
      });
    },
    getCummulativeSales() {
      SaleService.getCummulativeSales().then((res) => {
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
    formatDate(value) {
      const date = new Date(value);

      const formatted = date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return formatted;
    },
    formatTotalSales(value) {
      return value.toLocaleString("id-ID", {
        style: "unit",
        unit: "kilogram",
      });
    },
    refreshData() {
      this.getTotalSales();
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
  beforeUnmount() {
    // prevent memory leak
    clearInterval(this.interval);
  },
};
</script>