<script setup>
import { ClockIcon } from "@heroicons/vue/24/outline";
import { ref } from "vue";
import HairIcon from "@/components/icons/recipe-categories/IconHair.vue";
import SkinCareIcon from "@/components/icons/recipe-categories/SkinCare.vue";
import DamagedHairIcon from "@/components/icons/recipe-categories/DamagedHair.vue";
import IconRecipe from "@/components/icons/recipe/IconRecipe.vue";
import BackButton from "@/components/buttons/BackButton.vue";
import { onAuthStateChanged } from "firebase/auth";

const { $auth } = useNuxtApp();

const isUserLoggedIn = ref(false);

const hairTypeId = ref("");
const skinTypeId = ref("");

const arrOfSkinProblemId = ref([]);
const arrOfHairProblemId = ref([]);

const skinType = ref("");
const hairType = ref("");

const skinTypeName = ref("");
const hairTypeName = ref("");

const highlightSkinRecipes = ref([]);
const highlightHairRecipes = ref([]);

const skinCategorySlug = ref();
const hairCategorySlug = ref();
const skinProblemCount = ref("");
const hairProblemCount = ref("");

const noHairProblemId = "77b4ae6d-a31f-4de5-a731-1249cd87eeff";
const noSkinProblemId = "1ddab218-5489-4891-8fbb-1c7061271dc8";

function countProblems(arrOfProblemId) {
  if (
    arrOfProblemId[0] !== noHairProblemId &&
    arrOfProblemId[0] !== noSkinProblemId
  ) {
    return arrOfProblemId.length;
  } else {
    return 0;
  }
}

const token = useCookie("token");
const beautyProfile = useCookie("beautyProfile");

onMounted(() => {
  if (token.value) {
    localStorage.clear();
    beautyProfile.value = null;
  }
});

async function getRecipes() {
  const queryParams = new URLSearchParams({
    skin_type_id: skinTypeId.value,
    skin_issue_id: arrOfSkinProblemId.value.join(","),
    hair_type_id: hairTypeId.value,
    hair_issue_id: arrOfHairProblemId.value.join(","),
    limit: 5,
  });
  const dataRecipes = await fetchRecipes(queryParams);
  highlightSkinRecipes.value = dataRecipes.skinRecipe;
  skinCategorySlug.value = dataRecipes.skinRecipe[0].recipe_category_slug;
  skinProblemCount.value = countProblems(arrOfSkinProblemId.value);
  highlightHairRecipes.value = dataRecipes.hairRecipe;
  hairCategorySlug.value = dataRecipes.hairRecipe[0].recipe_category_slug;
  hairProblemCount.value = countProblems(arrOfHairProblemId.value);
}

async function fetchUserData(userToken) {
  const dataUser = await fetchUserBeautyProfile(userToken);
  skinTypeId.value = dataUser.physicalTrait[0].skin_type_id;
  hairTypeId.value = dataUser.physicalTrait[0].hair_type_id;
  arrOfHairProblemId.value = pushObjectValueInNewArr(dataUser.hairIssue);
  arrOfSkinProblemId.value = pushObjectValueInNewArr(dataUser.skinIssue);
}

const hairIssue = ref("");
const skinIssue = ref("");

function displayBeautyIssues(arrOfBeautyIssues) {
  const arrWithBeautyIssues = [];
  for (let i = 0; i < arrOfBeautyIssues.length; i++) {
    if (i === 0) {
      arrWithBeautyIssues.push(arrOfBeautyIssues[i].name);
    } else {
      arrWithBeautyIssues.push(arrOfBeautyIssues[i].name.toLowerCase());
    }
  }
  return arrWithBeautyIssues.join(", ");
}

async function getBeautyProfile() {
  const queryParams = new URLSearchParams({
    skin_type_id: skinTypeId.value,
    skin_issue_id: arrOfSkinProblemId.value.join(","),
    hair_type_id: hairTypeId.value,
    hair_issue_id: arrOfHairProblemId.value.join(","),
  });
  const data = await fetchBeautyProfile(queryParams);
  addIcon(data.skinType[0]);
  addIcon(data.hairType[0]);
  skinType.value = data.skinType[0];
  hairType.value = data.hairType[0];
  skinTypeName.value = data.skinType[0].name.toLowerCase();
  hairTypeName.value = data.hairType[0].name.toLowerCase();
  skinIssue.value = displayBeautyIssues(data.skinIssue);
  hairIssue.value = displayBeautyIssues(data.hairIssue);
}

function getDataInLocalStorage() {
  if (process.client) {
    hairTypeId.value = localStorage.getItem("hairType");
    skinTypeId.value = localStorage.getItem("skinType");
    const strOfHairProblemId = localStorage.getItem("hairProblem");
    const strOfSkinProblemId = localStorage.getItem("skinProblem");
    if (
      strOfHairProblemId &&
      strOfSkinProblemId &&
      skinTypeId.value &&
      hairTypeId.value
    ) {
      arrOfHairProblemId.value = JSON.parse(strOfHairProblemId);
      arrOfSkinProblemId.value = JSON.parse(strOfSkinProblemId);
    }
  }
}

onAuthStateChanged($auth, async (user) => {
  if (user) {
    isUserLoggedIn.value = true;
    await fetchUserData(await user.getIdToken(true));
  } else {
    isUserLoggedIn.value = false;
    getDataInLocalStorage();
  }
  const dataAvailable = Boolean(
    skinTypeId.value &&
      hairTypeId.value &&
      arrOfHairProblemId.value &&
      arrOfSkinProblemId.value
  );

  if (dataAvailable) {
    await Promise.all([getBeautyProfile(), getRecipes()]);
  }
});

useSeoMeta({
  title: "Mes recettes",
  ogTitle: "Mes recettes",
  description:
    "Découvrez une sélection de recettes cosmétiques adaptées à vos besoins.",
  ogDescription:
    "Découvrez une sélection de recettes cosmétiques adaptées à vos besoins.",
  ogImage: "/purecare-logo.jpg",
  twitterCard: "summary_large_image",
  twitterTitle: "Mes recettes",
  twitterDescription:
    "Découvrez une sélection de recettes cosmétiques adaptées à vos besoins.",
  twitterImage: "/purecare-logo.jpg",
});

definePageMeta({
  middleware: "beauty-profile",
  // pageTransition: {
  //   name: "slide-right",
  // },
});
</script>

<template>
  <div class="sm:pb-12 xl:mx-auto xl:max-w-7xl xl:px-8 px-4 py-12">
    <BackButton :route="'/'" />
    <ul
      class="flex justify-around p-4 border border-2 rounded-xl mt-6 mb-3 border-[#6ECDDF] grid gap-6 grid-cols-4 flex items-start text-center sm:w-full"
    >
      <li class="flex flex-col items-center">
        <component :is="skinType.icon" class="w-12 h-12 pb-1" />
        <p class="text-center text-xs md:text-sm font-bold">
          {{ `Peau ${skinTypeName}` }}
        </p>
      </li>
      <li class="flex flex-col items-center">
        <SkinCareIcon class="w-12 h-12" />
        <p class="text-center text-xs md:text-sm font-bold">
          {{ `Problèmes de peau (${skinProblemCount})` }}
        </p>
        <!-- <p class="text-center text-xs md:text-sm font-bold">
          {{ skinIssue }}
        </p> -->
      </li>
      <li class="flex flex-col items-center">
        <component :is="hairType.icon" class="w-12 h-12" />
        <p class="text-center text-xs md:text-sm font-bold">
          {{ `Cheveux ${hairTypeName}` }}
        </p>
      </li>
      <li class="flex flex-col items-center">
        <DamagedHairIcon class="w-12 h-12" />
        <p class="text-center text-xs md:text-sm font-bold">
          {{ `Problèmes capillaires (${hairProblemCount})` }}
        </p>
        <!-- <p class="text-center text-xs md:text-sm font-bold">
          {{ hairIssue }}
        </p> -->
      </li>
    </ul>

    <SubscribeBanner v-if="!isUserLoggedIn" />
    <NuxtLink
      v-else
      to="/mon-profil-beaute"
      class="flex-none rounded-full bg-[#27304D] px-3.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
      >Modifier mon profil beauté
      <span aria-hidden="true">&rarr;</span></NuxtLink
    >

    <div class="py-10">
      <div class="mb-4 px-4 sm:px-6 lg:px-8 xl:px-0 flex items-center">
        <h1 class="text-xl font-semibold lg:text-2xl text-gray-700 pb-3">
          Vos recettes beauté
        </h1>
        <IconRecipe class="ml-2 w-14" />
      </div>

      <!-- SOINS CHEVEUX -->
      <div
        class="px-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8 xl:px-0"
      >
        <div class="flex items-center">
          <h2 class="text-base font-bold tracking-tight text-gray-900">
            Soins cheveux
          </h2>
          <HairIcon class="w-8 ml-3" />
        </div>

        <NuxtLink
          :to="`/mes-recettes/${hairCategorySlug}`"
          class="hidden text-sm font-semibold text-[##27304D] hover:text-gray-500 sm:block"
        >
          Voir tout
          <span aria-hidden="true"> &rarr;</span>
        </NuxtLink>
      </div>

      <div class="mt-4 flow-root">
        <div class="-my-2">
          <div
            class="relative box-content h-80 overflow-y-hidden overflow-x-auto pb-5 pt-2 xl:overflow-visible"
          >
            <div
              class="absolute flex space-x-8 px-4 sm:px-6 lg:px-8 xl:relative xl:grid xl:grid-cols-5 xl:gap-x-8 xl:space-x-0 xl:px-0"
            >
              <div
                v-for="recipe in highlightHairRecipes"
                :key="recipe.id"
                class="relative flex h-80 w-56 flex-col overflow-hidden rounded-lg p-3 hover:opacity-75 xl:w-auto z-none items-end"
              >
                <likeRecipe
                  v-if="isUserLoggedIn"
                  :recipeId="recipe.id"
                  class="absolute z-10 flex"
                />
                <NuxtLink :to="`/recettes/${hairCategorySlug}/${recipe.slug}`">
                  <span aria-hidden="true" class="absolute inset-0">
                    <img
                      :src="recipe.img_url"
                      :alt="recipe.title"
                      class="h-full w-full object-cover object-center"
                    />
                  </span>
                  <span
                    aria-hidden="true"
                    class="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-gray-800 opacity-50"
                  />

                  <div
                    class="absolute right-0 left-0 bottom-4 px-4 mx-auto sm:px-2 lg:px-4 sm:bottom-2 lg:bottom-4"
                  >
                    <div
                      class="p-3 w-full bg-white bg-opacity-80 rounded rounded-lg"
                    >
                      <div class="flex flex-row items-center text-gray-800">
                        <p class="text-sm flex items-center">
                          <ClockIcon class="w-4 h-4 mr-1" />{{
                            recipe.preparation_time
                          }}
                          |
                          {{ recipe.ingredient_count }}
                          ingrédients
                        </p>
                      </div>
                      <p
                        class="mt-4 text-sm text-gray-800 sm:mt-2 lg:mt-3 font-bold"
                      >
                        {{ recipe.title }}
                      </p>
                    </div>
                  </div>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 px-4 sm:hidden text-right">
        <NuxtLink
          :to="`/mes-recettes/${hairCategorySlug}`"
          class="block text-sm font-semibold text-[##27304D] hover:text-gray-500"
        >
          Voir tout
          <span aria-hidden="true"> &rarr;</span>
        </NuxtLink>
      </div>
    </div>

    <!-- SOINS VISAGE-->

    <div
      class="px-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8 xl:px-0"
    >
      <h2 class="text-base font-bold tracking-tight text-gray-900 flex">
        Soins visage<SkinCareIcon class="w-10 h-10 ml-3" />
      </h2>
      <NuxtLink
        :to="`/mes-recettes/${skinCategorySlug}`"
        class="hidden text-sm font-semibold text-[##27304D] hover:text-gray-500 sm:block"
      >
        Voir tout
        <span aria-hidden="true"> &rarr;</span>
      </NuxtLink>
    </div>

    <div class="mt-4 flow-root">
      <div class="-my-2">
        <div
          class="relative box-content h-80 overflow-y-hidden overflow-x-auto pb-5 pt-2 xl:overflow-visible"
        >
          <div
            class="absolute flex space-x-8 px-4 sm:px-6 lg:px-8 xl:relative xl:grid xl:grid-cols-5 xl:gap-x-8 xl:space-x-0 xl:px-0"
          >
            <div
              v-for="recipe in highlightSkinRecipes"
              :key="recipe.id"
              class="relative flex h-80 w-56 flex-col overflow-hidden rounded-lg p-3 hover:opacity-75 xl:w-auto z-none items-end"
            >
              <likeRecipe
                v-if="isUserLoggedIn"
                :recipeId="recipe.id"
                class="absolute z-10"
              />

              <NuxtLink :to="`/recettes/${skinCategorySlug}/${recipe.slug}`">
                <span aria-hidden="true" class="absolute inset-0">
                  <img
                    :src="recipe.img_url"
                    alt=""
                    class="h-full w-full object-cover object-center"
                  />
                </span>
                <span
                  aria-hidden="true"
                  class="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-gray-800 opacity-50"
                />
                <div
                  class="absolute right-0 left-0 bottom-4 px-4 mx-auto sm:px-2 lg:px-4 sm:bottom-2 lg:bottom-4"
                >
                  <div
                    class="p-3 w-full bg-white bg-opacity-80 rounded rounded-lg"
                  >
                    <div class="flex flex-row items-center text-gray-800">
                      <p class="text-sm flex items-center">
                        <ClockIcon class="w-4 h-4 mr-1" />{{
                          recipe.preparation_time
                        }}
                        |
                        {{ recipe.ingredient_count }}
                        ingrédients
                      </p>
                    </div>
                    <p
                      class="mt-4 text-sm text-gray-800 sm:mt-2 lg:mt-3 font-bold"
                    >
                      {{ recipe.title }}
                    </p>
                  </div>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6 px-4 sm:hidden text-right">
      <NuxtLink
        :to="`/mes-recettes/${skinCategorySlug}`"
        class="block text-sm font-semibold text-[##27304D] hover:text-gray-500"
      >
        Voir tout
        <span aria-hidden="true"> &rarr;</span>
      </NuxtLink>
    </div>
  </div>
</template>
