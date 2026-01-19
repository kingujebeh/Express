<template>
  <RouterView />
</template>

<script>
import { useAuthStore } from "./store/auth";

const auth = useAuthStore();

const res = await auth.signup();

console.log(res)
</script>
