<script setup>
import Category from "@/components/Category.vue";
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import BackButton from "@/components/buttons/BackButton.vue";
import { onAuthStateChanged } from "firebase/auth";

const route = useRoute();
const recipeCategoryName = route.params.category;
const { $auth } = useNuxtApp();

const isUserLoggedIn = ref(false);

const hairTypeId = ref();
const skinTypeId = ref();

const arrOfSkinProblemId = ref();
const arrOfHairProblemId = ref();

let page = 1;
let limit = 9;
const PAGE_SIZE = 9;

function displayNextRecipes() {
  page++;
  if (recipeCategoryName === "cheveux") {
    if (hairRecipes.value.length === limit) {
      limit = PAGE_SIZE * page;
      getRecipes();
    }
  } else {
    if (skinRecipes.value.length === limit) {
      limit = PAGE_SIZE * page;
    }
    getRecipes();
  }
}

const canDisplayMoreRecipes = computed(() => {
  if (recipeCategoryName === "cheveux") {
    return hairRecipes.value.length >= limit;
  } else {
    return skinRecipes.value.length >= limit;
  }
});

async function fetchUserData(userToken) {
  const dataUser = await fetchUserBeautyProfile(userToken);
  skinTypeId.value = dataUser.physicalTrait[0].skin_type_id;
  hairTypeId.value = dataUser.physicalTrait[0].hair_type_id;
  arrOfHairProblemId.value = pushObjectValueInNewArr(dataUser.hairIssue);
  arrOfSkinProblemId.value = pushObjectValueInNewArr(dataUser.skinIssue);
}

const skinRecipes = ref([]);
const hairRecipes = ref([]);

async function getRecipes() {
  const queryParams = new URLSearchParams({
    skin_type_id: skinTypeId.value,
    skin_issue_id: arrOfSkinProblemId.value.join(","),
    hair_type_id: hairTypeId.value,
    hair_issue_id: arrOfHairProblemId.value.join(","),
    limit: limit,
  });
  const dataRecipes = await fetchRecipes(queryParams);
  skinRecipes.value = dataRecipes.skinRecipe;
  hairRecipes.value = dataRecipes.hairRecipe;
}

function getDataInLocalStorage() {
  if (process.client) {
    hairTypeId.value = localStorage.getItem("hairType") || "";
    skinTypeId.value = localStorage.getItem("skinType") || "";
    arrOfHairProblemId.value = JSON.parse(
      localStorage.getItem("hairProblem") || ""
    );
    arrOfSkinProblemId.value = JSON.parse(
      localStorage.getItem("skinProblem") || ""
    );
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

  await getRecipes();
});

useSeoMeta({
  title: `Mes recettes soins ${recipeCategoryName}`,
  ogTitle: `Mes recettes soins ${recipeCategoryName}`,
  description:
    "Découvrez une sélection de recettes cosmétiques adaptées à vos besoins.",
  ogDescription:
    "Découvrez une sélection de recettes cosmétiques adaptées à vos besoins.",
  ogImage:
    "https://i.notretemps.com/1800x0/smart/2021/04/20/cosmetiques-maison-lancez-vous.jpeg",
  twitterCard: "summary_large_image",
  twitterTitle: `Mes recettes soins ${recipeCategoryName}`,
  twitterDescription:
    "Découvrez une sélection de recettes cosmétiques adaptées à vos besoins.",
  twitterImage:
    "https://i.notretemps.com/1800x0/smart/2021/04/20/cosmetiques-maison-lancez-vous.jpeg",
});

definePageMeta({
  middleware: "beauty-profile",
});
</script>

<template>
  <div class="xl:px-8 px-4 py-8">
    <BackButton />
  </div>
  <Category
    :recipes="recipeCategoryName === 'cheveux' ? hairRecipes : skinRecipes"
    :categoryName="recipeCategoryName"
  />
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
