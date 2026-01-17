// stores/user.js
import { defineStore } from "pinia";
import { ref, reactive } from "vue";

import { useQuery } from "@vue/apollo-composable";



export const useAppStore = defineStore("app", () => {
  // state
  const name = ref("the-great-unknown");
  const initialized = ref(false);
  const data = reactive([]);

  // actions
  async function init() {
    try {

      initialized.value = true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  return {
    name,
    data,
    init,
    initialized
  };
});
