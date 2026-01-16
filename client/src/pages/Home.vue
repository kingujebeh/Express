<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-2xl font-bold">{{ name }}</h1>
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
        <h2 class="text-lg font-semibold capitalize">
          {{ pluralize(entity.name) }}
        </h2>
        <p class="text-gray-500">{{ entity.total }}</p>
        <!-- <div class="mt-2 flex gap-1">
          <img
            v-for="(item, i) in (entity.preview || []).slice(0, 3)"
            :key="i"
            :src="item.thumbnail || 'default.png'"
            class="w-10 h-10 object-cover rounded"
            alt="preview"
          />
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import pluralize from "pluralize";
import { useAppStore } from "../store";

const router = useRouter();
const { name, data } = useAppStore();

const entities = data; // already structured via structureModels()

function navigateTo(name) {
  router.push(`/${pluralize(name.toLowerCase())}`);
}
</script>
