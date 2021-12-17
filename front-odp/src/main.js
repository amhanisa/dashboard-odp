import { createApp } from "vue";
import App from "./App.vue";
import "./styles/styles.scss";
import router from "./router";
import store from "./store";
import setupInterceptors from "./services/setupInterceptors";
import PrimeVue from "primevue/config";
import "primeicons/primeicons.css";
import ConfirmationService from "primevue/confirmationservice";
import VueSocketIO from "vue-3-socket.io";
import SocketIO from "socket.io-client";
import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";
import CONFIG from "./config/index";

setupInterceptors(store);
const socketOptions = {
  debug: true,
  connection: SocketIO(CONFIG.WS_URL),
};

createApp(App)
  .use(store)
  .use(router)
  .use(new VueSocketIO(socketOptions))
  .use(PrimeVue)
  .use(ConfirmationService)
  .use(Toast, { position: POSITION.TOP_CENTER, maxToasts: 4 })
  .mount("#app");
