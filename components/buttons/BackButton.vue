<script setup>
import { ref, computed } from "vue";
import { ChevronLeftIcon } from "@heroicons/vue/20/solid";

const props = defineProps({
  route: String,
});
const router = useRouter();
</script>

<template>
  <div class="flex">
    <NuxtLink :to="props.route">
      <button class="text-gray-400 hover:text-gray-500">
        <ChevronLeftIcon class="h-6 w-6 flex-shrink-0" aria-hidden="true" />
        <span class="sr-only">Back</span>
      </button></NuxtLink
    >
  </div>
</template>
