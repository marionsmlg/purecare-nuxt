<script setup>
import { ref } from "vue";
import {
  RadioGroup,
  RadioGroupDescription,
  RadioGroupLabel,
  RadioGroupOption,
} from "@headlessui/vue";

const hairTypes = ref([]);
const selectedHairType = ref("");

async function fetchHairTypes() {
  try {
    const queryString = `/api/v1/hair-types`;
    const url = apiUrl + queryString;
    const response = await fetch(url);
    const data = await response.json();
    addIcon(data);
    hairTypes.value = data;
  } catch (error) {
    console.error(error);
  }
}

fetchHairTypes();
</script>

<template>
  <RadioGroup v-model="selectedHairType">
    <RadioGroupLabel class="sr-only">Hair Types</RadioGroupLabel>
    <div class="w-full grid grid-cols-2 gap-3 justify-center">
      <RadioGroupOption
        as="div"
        v-for="hairType in hairTypes"
        :key="hairType.id"
        :value="hairType.id"
        v-slot="{ active, checked }"
      >
        <div
          :class="[
            checked
              ? 'border-cyan-500 ring-1 ring-cyan-500'
              : 'border-gray-300',
            'relative block cursor-pointer rounded-xl border bg-white px-6 py-4 shadow-sm focus:outline-none w-40 md:w-56',
          ]"
        >
          <div class="flex flex-col items-center">
            <component :is="hairType.icon" class="w-20 h-20" />

            <span class="text-sm">
              <RadioGroupLabel as="span" class="font-medium text-gray-900">{{
                hairType.name
              }}</RadioGroupLabel>
            </span>
          </div>

          <span
            :class="[
              active ? 'border' : 'border-1',
              checked ? 'border-cyan-500' : 'border-transparent',
              'pointer-events-none absolute -inset-px rounded-xl',
            ]"
            aria-hidden="true"
          />
        </div>
      </RadioGroupOption>
    </div>
  </RadioGroup>
</template>
