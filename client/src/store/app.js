// stores/user.js
import { defineStore } from "pinia";
import axios from "axios";
import { ref, reactive } from "vue";

export const useAppStore = defineStore("app", () => {
  // state
  const name = ref("the-great-unknown");
  const initialized = ref(false);
  const data = reactive([]);

  // actions
  async function init() {
    try {
      const res = await axios.get(`/api/data/${name.value}`);

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
  };
});
