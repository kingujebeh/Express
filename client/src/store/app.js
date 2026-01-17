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
      const res = await axios.get("/api/data");

      data.push(...res.data);
      console.log(data);

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
