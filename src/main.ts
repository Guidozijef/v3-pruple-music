import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "./assets/css/common.scss";
import "./assets/iconFont/iconfont.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");

console.log("1581414085");
