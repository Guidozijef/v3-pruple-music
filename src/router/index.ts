import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/HomePage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "homePage",
      component: HomePage,
    },
    // {
    //   path: "/about",
    //   name: "about",
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () =>
    //     import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
    // },
    {
      path: "/self",
      name: "self",
      component: () => import("../views/SelfPage.vue"),
    },
    {
      path: "/songListDetails/songDetails/:songId",
      name: "songDetails",
      component: () => import("../views/SongDetails.vue"),
      meta: {
        keepAlive: true, // true 表示需要使用缓存 false表示不需要被缓存
      },
    },
    {
      path: "/songListDetails/songDetails/showSonging",
      name: "showSonging",
      component: () => import("../views/SongDetails.vue"),
      meta: {
        keepAlive: false, // true 表示需要使用缓存 false表示不需要被缓存
      },
    },
  ],
});

export default router;
