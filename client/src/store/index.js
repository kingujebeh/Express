// stores/user.js
import { ref, reactive } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { defineStore } from "pinia";
import { SIGNIN } from "../graphql/mutations/signin.js";
import { SIGNUP } from "../graphql/mutations/signup.js";

export const useStore = defineStore("auth", {
  state: () => ({
    name: "the-great-unknown",
    user: null,
    token: localStorage.getItem("token"),
    isAuthenticated: !!localStorage.getItem("token"),
    app: {
      initialized: false,
    },
  }),

  actions: {
    init() {
      this.app.initialized = true;
    },
    async signin(payload) {
      const { mutate } = useMutation(SIGNIN);

      const res = await mutate({ input: payload });

      this.token = res.data.signin.token;
      this.user = res.data.signin.user;
      this.isAuthenticated = true;

      localStorage.setItem("token", this.token);
    },

    async signup(payload) {
      const { mutate } = useMutation(SIGNUP);

      const res = await mutate({ input: payload });

      this.token = res.data.signup.token;
      this.user = res.data.signup.user;
      this.isAuthenticated = true;

      localStorage.setItem("token", this.token);
    },

    signout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      localStorage.removeItem("token");
    },
  },
});
