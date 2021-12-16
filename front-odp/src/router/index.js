import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Dashboard from "../views/Dashboard.vue";
import Admin from "../views/Admin.vue";
import MasterStock from "../components/MasterStock.vue";
import tokenService from "../services/token.service";

const checkAccess = (to, from, next) => {
  const token = tokenService.getLocalAccessToken();
  if (token) {
    next();
  } else {
    console.log("asd");
  }
};

const checkAdmin = (to, from, next) => {
  const user = tokenService.getUser();
  if (user.role === "ROLE_ADMIN") {
    next();
  }
};

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/sale",
    name: "Sale",
    component: () => import("../views/Sale.vue"),
    beforeEnter: [checkAccess],
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    beforeEnter: [checkAccess, checkAdmin],
  },
  {
    path: "/admin",
    name: "Admin",
    component: Admin,
    beforeEnter: [checkAccess, checkAdmin],
  },
  {
    path: "/masterstock",
    name: "Masterstock",
    component: MasterStock,
    beforeEnter: [checkAccess, checkAdmin],
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../components/Register.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
