import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import MainRoutes from "./MainRoutes";
import { allowedPath } from "@/utils/constants";

const routes: RouteRecordRaw[] = [
  {
    path: "/:pathMatch(.*)*",
    component: () => import("@/views/Error.vue")
  },
  {
    path: "/error/403",
    component: () => import("@/views/403.vue")
  },
  {
    path: "/technical-work",
    name: "TechnicalWork",
    component: () => import("@/views/TechnicalWork.vue")
  },
  MainRoutes
];

const setRoutes = () => {
  return routes.map((el) => {
    if (el.children) {
      return {
        ...el,
        children: el.children.map((e) => {
          return {
            ...e,
            path: `${allowedPath}${e.path}`
          };
        })
      };
    } else {
      if (el.path.includes("technical-work")) {
        return el;
      }
      return {
        ...el,
        path: `${allowedPath}${el.path}`
      };
    }
  });
};

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setRoutes(),
  scrollBehavior() {
    return { top: 0 };
  }
});

router.beforeEach(async (to, from, next) => {
  next();
});
