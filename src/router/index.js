import { createRouter, createWebHistory } from "vue-router";
import store from "../store";

import HomeView from "../views/Home.vue";
import SignUp from "@/views/SignUp";
import LogIn from "@/views/LogIn";
import Product from "@/views/Product";
import Cart from "@/views/Cart";
import Checkout from "@/views/Checkout";
import Success from "@/views/Success";
import Category from "@/views/Category.vue";
import Search from "@/views/Search.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/sign-up",
    name: "SignUp",
    component: SignUp,
  },
  {
    path: "/log-in",
    name: "LogIn",
    component: LogIn,
  },
  {
    path: "/:category_slug/:product_slug",
    name: "Product",
    component: Product,
  },
  {
    path: "/cart",
    name: "Cart",
    component: Cart,
  },
  {
    path: "/cart/success",
    name: "Success",
    component: Success,
  },
  {
    path: "/cart/checkout",
    name: "Checkout",
    component: Checkout,
    meta: {
      requireLogin: true,
    },
  },
  {
    path: "/:category_slug",
    name: "Category",
    component: Category,
  },
  {
    path: "/search",
    name: "Search",
    component: Search,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
router.beforeEach((to, from, next) => {
  if (
    to.matched.some((record) => record.meta.requireLogin) &&
    !store.state.isAuthenticated
  ) {
    next({ name: "LogIn", query: { to: to.path } });
  } else {
    next();
  }
});

export default router;
