<template>
  <div>
    <h3>{{ name }}</h3>
    <pre>{{ data }}</pre>
  </div>
</template>

<script setup>
import { useAppStore } from "../store";

const { name, data } = useAppStore();
</script>
