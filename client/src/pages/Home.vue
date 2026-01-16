<template>
  <div>
    <h3>{{ name }}</h3>

    <div v-for="(entity, index) in entities" :key="index">
      {{ pluralize(entity.name, entity.total) }} {{ entity.total }}
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import pluralize from "pluralize";

import { useAppStore } from "../store";

const { name, data } = useAppStore();

const entities = computed(() => {
  return [...data[0].data, ...data[1].data]
    .slice() // avoid mutating original array
    .sort((a, b) => a.name.localeCompare(b.name));
});
</script>
