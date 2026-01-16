<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-2xl font-bold">{{ pluralize(entityName) }}</h1>
      <span class="text-gray-500">{{ total }} items</span>
    </div>

    <!-- Grid -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <div
        v-for="entity in entities"
        :key="entity.name"
        class="bg-white shadow rounded p-4 hover:shadow-lg cursor-pointer"
        @click="navigateTo(entity.name)"
      >
        <h2 class="text-lg font-semibold capitalize">{{ entity.name }}</h2>
        <p class="text-gray-500">{{ entity.total }} items</p>
        <div class="mt-2 flex gap-1">
          <img
            v-for="(item, i) in (entity.preview || []).slice(0, 3)"
            :key="i"
            :src="item.thumbnail || 'default.png'"
            class="w-10 h-10 object-cover rounded"
            alt="preview"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import pluralize from "pluralize";
import { useAppStore } from "../store";

const router = useRouter();
const { data } = useAppStore();

console.log(data);
const entityName = "Entities"; // can be dynamic based on route
const entities = data; // already structured via structureModels()
const total = entities.reduce((sum, e) => sum + e.total, 0);

function navigateTo(name) {
  router.push(`/entity/${name.toLowerCase()}`);
}
</script>
