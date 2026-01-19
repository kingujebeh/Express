import "@unocss/reset/tailwind.css";
import "uno.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import { DefaultApolloClient } from "@vue/apollo-composable";

import router from "./router";

import App from "./App.vue";
import { apolloClient } from "./graphql/apollo";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

app.provide(DefaultApolloClient, apolloClient);

app.mount("#app");
