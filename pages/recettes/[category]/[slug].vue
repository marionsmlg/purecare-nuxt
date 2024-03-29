<script setup>
import { ref } from "vue";
import {
  BeakerIcon,
  ChevronUpIcon,
  InformationCircleIcon,
  ShoppingBagIcon,
} from "@heroicons/vue/24/outline";
import IconHair from "@/components/icons/recipe-categories/IconHair.vue";
import IconSkin from "@/components/icons/recipe-categories/IconSkin.vue";
import IconConservation from "../components/icons/recipe/IconConservation.vue";
import IconTexture from "../components/icons/recipe/IconTexture.vue";
import IconClock from "../components/icons/recipe/IconClock.vue";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { onAuthStateChanged } from "firebase/auth";
import BackToPreviousRoute from "../../../components/buttons/BackToPreviousRoute.vue";

const { $auth } = useNuxtApp();
const isUserLoggedIn = ref(false);

onAuthStateChanged($auth, async (user) => {
  if (user) {
    isUserLoggedIn.value = true;
  } else {
    isUserLoggedIn.value = false;
  }
});

const route = useRoute();
const recipeSlug = route.params.slug;

function displayAllergens(fetchedAllergens) {
  if (fetchedAllergens.length === 0) {
    return "Pas d'allergènes";
  } else {
    const arrOfAllergens = [];
    for (const objet of fetchedAllergens) {
      arrOfAllergens.push(objet.name);
    }
    return arrOfAllergens.join(", ");
  }
}
function displayPhysicalTraits(arrOfPhysicalTrait) {
  const arrOfPhysicalTraitWithoutObject = [];
  for (const physicalTrait of arrOfPhysicalTrait) {
    if (physicalTrait.name === "Normale") {
      arrOfPhysicalTraitWithoutObject.push("Tous types");
    } else {
      arrOfPhysicalTraitWithoutObject.push(physicalTrait.name);
    }
  }
  return arrOfPhysicalTraitWithoutObject.join(" | ");
}

function displayBeautyIssues(arrOfBeautyIssues) {
  const arrOfBeautyIssuesWithoutObject = [];
  for (const beautyIssue of arrOfBeautyIssues) {
    if (beautyIssue.name !== "Aucun problème") {
      arrOfBeautyIssuesWithoutObject.push(beautyIssue.name);
    }
  }
  return arrOfBeautyIssuesWithoutObject;
}

const recipe = ref({});
const recipeIngredients = ref();
const recipeSteps = ref([]);
const recipeBenefits = ref([]);
const recipeAllergens = ref([]);
const recipeBeautyIssues = ref([]);
const recipePhysicalTrait = ref([]);

async function fetchDataRecipeBySlug(recipeSlug) {
  try {
    const queryString = `/api/v1/recipe?slug=${recipeSlug}`;
    const url = apiUrl + queryString;
    const response = await fetch(url);
    const dataRecipe = await response.json();
    recipe.value = dataRecipe.recipe[0];
    recipeIngredients.value = dataRecipe.ingredient;
    recipeSteps.value = dataRecipe.step;
    recipeBenefits.value = dataRecipe.benefit;
    recipeAllergens.value = displayAllergens(dataRecipe.allergen);
    recipeBeautyIssues.value = displayBeautyIssues(dataRecipe.beautyIssue);
    recipePhysicalTrait.value = displayPhysicalTraits(dataRecipe.physicalTrait);
  } catch (error) {
    console.error(error);
  }
}

onMounted(async () => {
  await fetchDataRecipeBySlug(recipeSlug);
});

useSeoMeta({
  title: () => recipe.value.title,
  description: () => `Découvrez notre recette de ${recipe.value.title}`,
  ogType: "website",
  ogTitle: () => recipe.value.title,
  ogDescription: () => `Découvrez notre recette de ${recipe.value.title}`,
  ogImage: () => recipe.value.img_url,
  twitterCard: "summary_large_image",
  twitterTitle: () => recipe.value.title,
  twitterDescription: () => `Découvrez notre recette de ${recipe.value.title}`,
  twitterImage: () => recipe.value.img_url,
});
</script>

<template>
  <div class="flex flex-col lg:px-32 px-4 py-8">
    <BackToPreviousRoute />
  </div>
  <div class="px-4 pt-6 flex flex-col items-center">
    <div class="flex flex-col items-center md:items-start md:flex-row mb-8">
      <h1 class="text-2xl font-bold text-center text-gray-900 mr-3 mb-2">
        {{ recipe.title }}
      </h1>
      <likeRecipe :recipeId="recipe.id" v-if="isUserLoggedIn" />
    </div>

    <div class="flex flex-wrap justify-center gap-x-6 gap-y-4 mb-8">
      <span
        v-for="benefit in recipeBenefits"
        class="bg-[#FBDFDB] inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-sm font-medium text-gray-900 ring-1 ring-inset ring-gray-200"
      >
        {{ benefit.name }}
      </span>
    </div>

    <div
      class="flex flex-wrap justify-center gap-x-6 gap-y-4 mb-8"
      v-if="recipeBeautyIssues.length !== 0"
    >
      <span
        v-for="beautyIssue in recipeBeautyIssues"
        class="bg-[#C7E8F1] inline-flex items-center text-center gap-x-1.5 rounded-full px-2 py-1 text-sm font-medium text-gray-900 ring-1 ring-inset ring-gray-200"
      >
        {{ beautyIssue }}
      </span>
    </div>
  </div>

  <div class="flex flex-col items-center">
    <div class="flex w-full lg:w-4/5 h-96 overflow-hidden lg:mb-8">
      <img
        :src="recipe.img_url"
        class="w-full h-auto object-cover lg:rounded-xl"
      />
    </div>

    <div
      class="bg-[#FBDFDB] lg:w-4/5 lg:rounded-xl w-full px-4 py-3 flex justify-center"
    >
      <div
        class="grid grid-cols-2 gap-12 sm:gap-6 sm:grid-cols-4 flex items-baseline text-center sm:w-full"
      >
        <div class="flex flex-col items-center">
          <IconTexture class="w-8 h-8" />
          <p class="text-sm mt-2 font-semibold">Texture</p>
          <p class="text-sm mt-2">{{ recipe.product_texture_type_name }}</p>
        </div>
        <div class="flex flex-col items-center">
          <IconClock class="w-8 h-8" />
          <p class="text-sm mt-2 font-semibold">Préparation</p>
          <p class="text-sm mt-2">{{ recipe.preparation_time }}</p>
        </div>
        <div class="flex flex-col items-center">
          <component
            :is="
              recipe.recipe_category_name === 'Cheveux' ? IconHair : IconSkin
            "
            class="w-8"
          ></component>
          <p class="text-sm mt-2 font-semibold">
            {{
              recipe.recipe_category_name === "Cheveux"
                ? "Type de cheveux"
                : "Type de peau"
            }}
          </p>
          <p class="text-sm flex flex-row mt-2">{{ recipePhysicalTrait }}</p>
        </div>

        <div class="flex flex-col items-center">
          <IconConservation class="w-10 h-10" />
          <p class="text-sm mt-2 font-semibold">Conservation</p>
          <p class="text-sm mt-2">{{ recipe.storage_time }}</p>
        </div>
      </div>
    </div>

    <div class="flex justify-end px-4 py-4 text-gray-600">
      <p class="truncate text-sm mr-2">
        Pour {{ recipe.product_quantity }} {{ recipe.product_quantity_unit }}
      </p>
      <div><BeakerIcon class="w-6 h-6" /></div>
    </div>
  </div>

  <div class="px-4 py-8 w-full">
    <div class="flex flex-col items-center mb-12 w-full">
      <h2 class="text-2xl font-semibold mb-4">Ingrédients</h2>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 w-full lg:w-7/12">
        <div
          v-for="ingredient in recipeIngredients"
          class="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm"
        >
          <img
            class="mx-auto h-14 w-14 flex-shrink-0 rounded-full object-cover"
            :src="ingredient.img_url"
            alt=""
          />
          <div class="min-w-0 flex-1">
            <div class="flex items-start justify-between">
              <p class="text-sm font-medium text-gray-900">
                {{ ingredient.name }}
              </p>
              <div class="flex items-start">
                <div class="inline-flex">
                  <Menu as="div" class="relative -ml-px block">
                    <MenuButton
                      class="relative inline-flex items-center mx-2 bg-white text-gray-500 hover:text-gray-700 focus:z-10"
                    >
                      <span class="sr-only">Open options</span>
                      <InformationCircleIcon
                        v-if="ingredient.description"
                        class="h-5 w-5"
                        aria-hidden="true"
                      />
                    </MenuButton>

                    <transition
                      enter-active-class="transition ease-out duration-100"
                      enter-from-class="transform opacity-0 scale-95"
                      enter-to-class="transform opacity-100 scale-100"
                      leave-active-class="transition ease-in duration-75"
                      leave-from-class="transform opacity-100 scale-100"
                      leave-to-class="transform opacity-0 scale-95"
                    >
                      <MenuItems
                        class="absolute right-0 z-10 -mr-1 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                      >
                        <div class="py-1">
                          <MenuItem>
                            <p class="block px-4 py-2 text-sm text-gray-500">
                              {{ ingredient.description }}
                            </p>
                          </MenuItem>
                        </div>
                      </MenuItems>
                    </transition>
                  </Menu>
                </div>

                <button
                  class="relative inline-flex items-center rounded-full bg-white text-gray-500 hover:text-gray-700 focus:z-10"
                >
                  <a
                    v-if="ingredient.product_url"
                    :href="ingredient.product_url"
                    target="_blank"
                  >
                    <ShoppingBagIcon class="h-5 w-5" />
                  </a>
                </button>
              </div>
            </div>

            <p class="truncate text-sm text-gray-500">
              {{ ingredient.ingredient_quantity }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col items-center mb-12 w-full">
      <h2 class="text-2xl font-semibold mb-4">Recette</h2>

      <div class="flex flex-col border rounded-xl px-8 py-2 lg:w-7/12">
        <div v-for="step in recipeSteps" class="py-8 border-b last:border-none">
          <p class="font-semibold text-gray-900">
            Étape {{ step.step_number }}
          </p>
          <p class="text-gray-500">{{ step.step }}</p>
        </div>
      </div>
    </div>

    <div class="flex flex-col items-center w-full">
      <h2 class="text-2xl font-semibold mb-4">Mode d'emploi</h2>

      <div
        class="flex flex-col border rounded-xl px-8 pt-4 pb-8 w-full lg:w-7/12"
      >
        <div class="py-8 border-b">
          <p>{{ recipe.instructions }}</p>
        </div>

        <div class="w-full">
          <Disclosure v-slot="{ open }">
            <DisclosureButton
              class="flex w-full justify-between pt-8 text-left font-medium font-semibold text-gray-900"
            >
              <span>Précautions</span>
              <ChevronUpIcon
                :class="open ? 'rotate-180 transform' : ''"
                class="h-5 w-5"
              />
            </DisclosureButton>
            <DisclosurePanel class="pt-4 pb-4 text-gray-500">
              {{ recipe.safety_precautions }}
            </DisclosurePanel>
          </Disclosure>

          <Disclosure as="div" class="mt-8 border-t" v-slot="{ open }">
            <DisclosureButton
              class="flex w-full justify-between pt-8 text-left font-medium font-semibold text-gray-900"
            >
              <span>Allergènes</span>
              <ChevronUpIcon
                :class="open ? 'rotate-180 transform' : ''"
                class="h-5 w-5"
              />
            </DisclosureButton>
            <DisclosurePanel class="pt-4 pb-4 text-gray-500">
              {{ recipeAllergens }}
            </DisclosurePanel>
          </Disclosure>

          <Disclosure as="div" class="mt-8 border-t" v-slot="{ open }">
            <DisclosureButton
              class="flex w-full justify-between pt-8 text-left font-medium font-semibold text-gray-900"
            >
              <span>Conservation</span>
              <ChevronUpIcon
                :class="open ? 'rotate-180 transform' : ''"
                class="h-5 w-5"
              />
            </DisclosureButton>
            <DisclosurePanel class="pt-4 pb-4 text-gray-500">
              {{ recipe.storage_method }}
            </DisclosurePanel>
          </Disclosure>
        </div>
      </div>
    </div>
  </div>
</template>
