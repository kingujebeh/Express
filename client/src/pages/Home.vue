<template>
  <div>
    <h3>{{ name }}</h3>
    <div v-for="(entity, index) in entities" :key="index">
      {{ capitalize(pluralize(entity.name, entity.total)) }}
      {{ entity.total }}
    </div>
  </div>
</template>

<script setup>
import pluralize from "pluralize";
import { useAppStore } from "../store";

const { name, data } = useAppStore();

const entities = [...data].sort((a, b) => a.name.localeCompare(b.name));

// Capitalize first letter only
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
</script>
