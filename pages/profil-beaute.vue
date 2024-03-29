<script setup>
import SkinTypes from "../components/beauty-profile/SkinTypes.vue";
import SkinHairProblems from "../components/beauty-profile/SkinHairProblems.vue";
import HairTypes from "../components/beauty-profile/HairTypes.vue";
import BackButton from "../components/buttons/BackButton.vue";
import { ref, computed } from "vue";
import { onAuthStateChanged } from "firebase/auth";

const { $auth } = useNuxtApp();

const skinProblems = ref([]);
const hairProblems = ref([]);

async function fetchBeautyIssues() {
  try {
    const queryString = `/api/v1/beauty-issue`;
    const url = apiUrl + queryString;
    const response = await fetch(url);
    const data = await response.json();
    skinProblems.value = data.skinIssue;
    hairProblems.value = data.hairIssue;
  } catch (error) {
    console.error(error);
  }
}

fetchBeautyIssues();

const quizData = [
  {
    text: "Quel est votre type de peau ?",
    component: SkinTypes,
    instance: "skinType",
  },
  {
    text: "Avez-vous des problèmes de peau spécifiques ?",
    component: SkinHairProblems,
    instance: "skinProblems",
  },
  {
    text: "Quelle est votre texture de cheveux naturelle ?",
    component: HairTypes,
    instance: "hairType",
  },
  {
    text: "Avez-vous des problèmes capillaires spécifiques ?",
    component: SkinHairProblems,
    instance: "hairProblems",
  },
];

//////////////////////////////////

const selectedOption = ref({});
const selectedSkinProblem = ref([]);
const selectedHairProblem = ref([]);

const allQuestionsAnswered = computed(() => {
  return (
    selectedOption.value["skinType"] &&
    selectedOption.value["hairType"] &&
    selectedSkinProblem.value.length !== 0 &&
    selectedHairProblem.value.length !== 0
  );
});

function updateCheckboxes({ instance, values }) {
  if (instance === "skinProblems") {
    selectedSkinProblem.value = values;
  } else if (instance === "hairProblems") {
    selectedHairProblem.value = values;
  }
}

const router = useRouter();

function quizDataAreUuids() {
  const arePhysicalTraitsIdsValid =
    uuidIsValid(selectedOption.value["skinType"]) &&
    uuidIsValid(selectedOption.value["hairType"]);

  for (const hairTypeId of selectedHairProblem.value) {
    const isHairTypeIdValid = uuidIsValid(hairTypeId);

    if (!isHairTypeIdValid) {
      return false;
    }
  }
  for (const skinTypeId of selectedSkinProblem.value) {
    const isSkinTypeIdValid = uuidIsValid(skinTypeId);

    if (!isSkinTypeIdValid) {
      return false;
    }
  }
  return arePhysicalTraitsIdsValid;
}

async function setCookieAndRedirect() {
  return new Promise((resolve) => {
    const beautyProfile = useCookie("beautyProfile");
    beautyProfile.value = true;
    const interval = setInterval(() => {
      if (beautyProfile.value) {
        clearInterval(interval);
        resolve();
      }
    }, 100);
  }).then(() => {
    return router.push("/mes-recettes");
  });
}

function setBeautyProfileInLocalStorage() {
  if (process.client) {
    localStorage.setItem("skinType", selectedOption.value["skinType"]);
    localStorage.setItem("hairType", selectedOption.value["hairType"]);
    localStorage.setItem(
      "skinProblem",
      JSON.stringify(selectedSkinProblem.value)
    );
    localStorage.setItem(
      "hairProblem",
      JSON.stringify(selectedHairProblem.value)
    );
  }
}

async function findRecipes() {
  onAuthStateChanged($auth, async (user) => {
    if (user && quizDataAreUuids()) {
      postData(`${apiUrl}/api/v1/users`, {
        skin_type_id: selectedOption.value["skinType"],
        hair_type_id: selectedOption.value["hairType"],
        skin_issue_id: selectedSkinProblem.value.join(","),
        hair_issue_id: selectedHairProblem.value.join(","),
      }).then(() => router.push("/mes-recettes"));
    } else {
      if (quizDataAreUuids() && allQuestionsAnswered) {
        setBeautyProfileInLocalStorage();
        await setCookieAndRedirect();
      } else {
        console.error("Les donnees ne sont pas valides!!!");
      }
    }
  });
}

useSeoMeta({
  title: "Profil beauté - PureCare",
  ogTitle: "Profil beauté - PureCare",
  description:
    "Découvrez une sélection de recettes cosmétiques adaptées à vos besoins.",
  ogDescription:
    "Découvrez une sélection de recettes cosmétiques adaptées à vos besoins.",
  ogImage: "/purecare-logo.jpg",
  twitterCard: "summary_large_image",
  twitterTitle: "Profil beauté - PureCare",
  twitterDescription:
    "Découvrez une sélection de recettes cosmétiques adaptées à vos besoins.",
  twitterImage: "/purecare-logo.jpg",
});
definePageMeta({
  middleware: "no-beauty-profile",
});
</script>

<template>
  <div class="py-12 max-w-6xl m-auto px-4">
    <BackToPreviousRouteVue />
    <div v-for="(question, index) in quizData" :key="index" class="py-10">
      <div class="flex flex-col items-center">
        <h1 class="text-xl font-bold text-center mb-8">{{ question.text }}</h1>
        <component
          v-if="
            question.instance === 'skinProblems' ||
            question.instance === 'hairProblems'
          "
          :problems="
            question.instance === 'skinProblems'
              ? skinProblems
              : question.instance === 'hairProblems'
              ? hairProblems
              : ''
          "
          :is="question.component"
          :instance="question.instance"
          @updateCheckboxes="updateCheckboxes"
          :initialSelectedOptions="[]"
        />
        <component
          v-else
          :is="question.component"
          :instance="question.instance"
          v-model="selectedOption[question.instance]"
        />
      </div>
    </div>
    <div class="flex justify-center">
      <button
        :disabled="!allQuestionsAnswered"
        type="submit"
        :class="[
          !allQuestionsAnswered
            ? 'bg-sky-200 text-gray-500 cursor-not-allowed'
            : 'bg-[#8CD4E0] hover:bg-[#6ECDDF]',
          'rounded-xl px-24 py-3 md:text-base text-sm font-bold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
        ]"
        @click="findRecipes"
      >
        Trouver mes recettes !
      </button>
    </div>
  </div>
</template>
