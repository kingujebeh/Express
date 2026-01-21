import { createWebHistory, createRouter } from "vue-router";
import { useStore } from "../store";
import routes from "./routes";

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const { app, init } = useStore();

  // 1️⃣ Initialize workstation once
  if (!app.initialized) {
    try {
      console.log("Initializing App...");
      await init();
    } catch (err) {
      console.error("App initialization failed:", err);
      return next(false);
    }
  }

  // 3️⃣ Proceed
  next();
});

export default router;
