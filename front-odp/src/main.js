import { createApp } from "vue";
import App from "./App.vue";
import "./styles/styles.scss";
import router from "./router";
import store from "./store";
import setupInterceptors from "./services/setupInterceptors";
import PrimeVue from "primevue/config";
import Spinner from "./components/Spinner.vue";

setupInterceptors(store);

createApp(App)
  .use(store)
  .use(router)
  .use(PrimeVue)
  .component("Spinner", Spinner)
  .mount("#app");
