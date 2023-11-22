<script setup>
import { ref, computed } from "vue";
import ListBox from "../components/buttons/ListBox.vue";
import { CursorArrowRaysIcon } from "@heroicons/vue/20/solid";

const skinProblems = ref([]);
const hairProblems = ref([]);
const bodyParts = ref([]);

async function fetchRecipeCategories() {
  try {
    const queryString = "/api/v1/recipe-category";
    const response = await fetch(apiUrl + queryString);
    const data = await response.json();
    bodyParts.value = data;
  } catch (error) {
    console.error(error);
  }
}
fetchRecipeCategories();

async function fetchBeautyIssues() {
  try {
    const queryString = "/api/v1/beauty-issue";
    const response = await fetch(apiUrl + queryString);
    const data = await response.json();
    skinProblems.value = data.skinIssue;
    hairProblems.value = data.hairIssue;
  } catch (error) {
    console.error(error);
  }
}
fetchBeautyIssues();

const selectedBodyPart = ref({ name: "" });
const selectedProblem = ref(null);
const isDisabled = ref(true);

const getBodyPartValue = (value) => {
  selectedBodyPart.value = value;
  selectedProblem.value = "";
  isDisabled.value = false;
};

const getProblemValue = (value) => {
  selectedProblem.value = value;
};

const allOptionsSelected = computed(() => {
  return selectedBodyPart.name !== "" && selectedProblem.value;
});

const selectedProblems = computed(() => {
  if (selectedBodyPart.value.name === "Visage") {
    return skinProblems.value;
  } else {
    return hairProblems.value;
  }
});

const router = useRouter();

function findRecipes() {
  router.push({
    path: `/recettes/${selectedBodyPart.value.slug}`,
    query: { issue: selectedProblem.value.slug },
  });
}
</script>

<template>
  <section class="bg-[#FBDFDB] py-10 px-16 md:rounded-xl">
    <div class="flex justify-center lg:justify-start">
      <h2 class="font-bold mb-6 mr-2 text-center md:text-left lg:text-xl">
        Trouver ma recette en 2 clics
      </h2>
      <CursorArrowRaysIcon class="w-5 h-5" />
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3 lg:gap-12 gap-4 items-center">
      <div class="flex justify-center lg:justify-start">
        <ListBox
          :options="bodyParts"
          placeholder="Partie du corps"
          @update:model-value="getBodyPartValue"
        />
      </div>
      <div class="flex justify-center lg:justify-start">
        <ListBox
          :options="selectedProblems"
          @update:model-value="getProblemValue"
          placeholder="Type de problème"
          :isDisabled="isDisabled"
        />
      </div>

      <div class="flex justify-center lg:justify-start">
        <button
          @click="findRecipes"
          type="button"
          :disabled="!allOptionsSelected"
          :class="[
            !allOptionsSelected
              ? 'bg-red-200 cursor-not-allowed text-gray-400'
              : 'bg-[#F3B8B4] hover:bg-[#F19B95]',
            'w-full md:px-14 md:py-3 w-full rounded-xl px-3 py-2 text-md font-bold shadow-sm',
          ]"
        >
          Trouver ma recette
        </button>
      </div>
    </div>
  </section>
</template>
