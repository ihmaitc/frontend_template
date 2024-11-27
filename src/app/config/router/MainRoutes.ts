import { RouteRecordRaw } from "vue-router";

const MainRoutes: RouteRecordRaw = {
  path: "/main",
  component: () => import("@/app/config/layouts/FullLayout.vue"),
  children: [
    {
      path: "/",
      redirect: "/home"
    },
    {
      name: "Dashboard",
      path: "/home",
      component: () => import("@/views/dashboard.vue")
    }
  ]
};

export default MainRoutes;
