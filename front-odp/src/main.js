import { createApp } from "vue";
import App from "./App.vue";
import "./styles/styles.scss";
import router from "./router";
import store from "./store";
import setupInterceptors from "./services/setupInterceptors";
import PrimeVue from "primevue/config";
import "primeicons/primeicons.css";
import ConfirmationService from "primevue/confirmationservice";

setupInterceptors(store);

createApp(App)
  .use(store)
  .use(router)
  .use(PrimeVue)
  .use(ConfirmationService)
  .mount("#app");
