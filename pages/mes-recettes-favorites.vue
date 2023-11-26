<script setup>
import Category from "@/components/Category.vue";
import { ref, computed } from "vue";
import BackButton from "@/components/buttons/BackButton.vue";
import IconRecipe from "@/components/icons/recipe/IconRecipe.vue";
import { HeartIcon } from "@heroicons/vue/24/outline";

let page = 1;
let limit = 9;
const PAGE_SIZE = 9;

function displayNextRecipes() {
  page++;

  if (favoriteRecipes.value.length === limit) {
    limit = PAGE_SIZE * page;

    fetchFavoriteRecipes();
  }
}

const canDisplayMoreRecipes = computed(() => {
  return favoriteRecipes.value.length > limit;
});

const favoriteRecipes = ref([]);
const hasFavoriteRecipes = ref(false);

async function fetchFavoriteRecipes(queryParams) {
  try {
    const queryString = `/api/v1/user-favorite-recipe?${queryParams}`;
    const url = apiUrl + queryString;
    const response = await fetch(url);
    const dataRecipes = await response.json();
    return dataRecipes;
  } catch (error) {
    console.error(error);
  }
}
const token = useCookie("token");

async function getRecipes() {
  const queryParams = new URLSearchParams({
    user_token: token.value,
    limit: limit,
  });
  const userRecipes = await fetchFavoriteRecipes(queryParams);
  favoriteRecipes.value = userRecipes;
  hasFavoriteRecipes.value = userRecipes.length > 0;
}
getRecipes();

definePageMeta({
  middleware: "user-beauty-profile",
});
</script>

<template>
  <div class="xl:px-8 px-4 py-8">
    <BackButton :route="'/mes-recettes'" />
  </div>
  <Category :recipes="favoriteRecipes" :categoryName="'Mes favoris'" />
  <div
    v-if="!hasFavoriteRecipes"
    class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 sm:py-6 lg:py-8"
  >
    <div class="mx-auto max-w-3xl flex items-center flex-col">
      <div class="flex items-center">
        <h2 class="text-gray-400 text-center md:text-xl flex-1">
          C'est le moment parfait pour créer votre collection de recettes
          favorites. Ajoutez-en quelques-unes !
        </h2>
      </div>
      <IconRecipe :color="'#c0c5cc'" class="w-36 h-36 md:w-56 md:h-56" />
    </div>
  </div>

  <div class="flex justify-center" v-if="canDisplayMoreRecipes">
    <button
      @click="displayNextRecipes"
      type="button"
      class="md:px-14 md:py-3 w-auto rounded-xl bg-[#8CD4E0] px-3 py-2 text-md font-bold shadow-sm hover:bg-[#1AB2CC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      Afficher plus de recettes
    </button>
  </div>
</template>
