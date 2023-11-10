<script setup>
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  sendEmailVerification,
} from "firebase/auth";
import { ref } from "vue";
import FacebookIcon from "@/components/icons/social-media/facebook.vue";
import GoogleIcon from "@/components/icons/social-media/google.vue";
import { fetchUserBeautyProfile } from "@/utils.js";

const { $auth } = useNuxtApp();
const router = useRouter();

async function loginWithFacebook() {
  const provider = new FacebookAuthProvider();
  try {
    const result = await signInWithPopup($auth, provider);
    const user = result.user;
    const token = useCookie("token");
    token.value = await user.getIdToken(true);
    const hasBeautyProfile = await fetchUserBeautyProfile(
      await user.getIdToken(true)
    );
    if (hasBeautyProfile) {
      router.push("/mes-recettes");
    } else {
      router.push("/profil-beaute");
    }
  } catch (error) {
    console.error(error);
  }
}

async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup($auth, provider);
    const user = result.user;
    const token = useCookie("token");
    token.value = await user.getIdToken(true);
    const hasBeautyProfile = await fetchUserBeautyProfile(
      await user.getIdToken(true)
    );
    if (hasBeautyProfile) {
      router.push("/mes-recettes");
    } else {
      router.push("/profil-beaute");
    }
  } catch (error) {
    console.error(error);
  }
}

const userEmail = ref();
const userPassword = ref();
const userConfirmPassword = ref();

const hairTypeId = ref("");
const skinTypeId = ref("");
const strOfHairProblemId = ref("");
const strOfSkinProblemId = ref("");

if (process.client) {
  hairTypeId.value = localStorage.getItem("hairType");
  skinTypeId.value = localStorage.getItem("skinType");
  strOfHairProblemId.value = localStorage.getItem("hairProblem");
  strOfSkinProblemId.value = localStorage.getItem("skinProblem");
}

const beautyProfileCompleted = Boolean(
  hairTypeId.value &&
    skinTypeId.value &&
    strOfSkinProblemId.value &&
    strOfHairProblemId.value
);

const showErrorMessage = ref(false);
const errorMessage = ref("");

async function createUser() {
  if (userPassword.value === userConfirmPassword.value) {
    createUserWithEmailAndPassword($auth, userEmail.value, userPassword.value)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const token = useCookie("token");
        token.value = await user.getIdToken(true);
        const hasBeautyProfile = await fetchUserBeautyProfile(
          await user.getIdToken(true)
        );
        if (beautyProfileCompleted && !hasBeautyProfile) {
          const arrOfHairProblemId = JSON.parse(strOfHairProblemId.value);
          const arrOfSkinProblemId = JSON.parse(strOfSkinProblemId.value);
          postData(`${apiUrl}/api/v1/users`, {
            skin_type_id: skinTypeId.value,
            hair_type_id: hairTypeId.value,
            skin_issue_id: arrOfSkinProblemId.join(","),
            hair_issue_id: arrOfHairProblemId.join(","),
          }).then(() => router.push("/mes-recettes"));
        } else {
          router.push("/profil-beaute");
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        showErrorMessage.value = true;
        if (errorCode === "auth/weak-password") {
          errorMessage.value =
            "Le mot de passe doit contenir au moins 6 caractères.";
        } else if (errorCode === "auth/email-already-in-use") {
          errorMessage.value =
            "Désolé, cet e-mail est déjà associé à un compte. Veuillez utiliser un autre e-mail.";
        } else {
          errorMessage.value =
            "Une erreur est survenue lors de votre inscription. Veuillez réessayer ultérieurement.";
        }
      });
  } else {
    showErrorMessage.value = true;
    errorMessage.value = "Les mots de passe ne correspondent pas.";
  }
}
useSeoMeta({
  title: "S'incrire - PureCare",
  ogTitle: "S'incrire - PureCare",
  description:
    "Découvrez une sélection de recettes cosmétiques adaptées à vos besoins.",
  ogDescription:
    "Découvrez une sélection de recettes cosmétiques adaptées à vos besoins.",
  ogImage: "/purecare-logo.jpg",
  twitterCard: "summary_large_image",
  twitterTitle: "S'incrire - PureCare",
  twitterDescription:
    "Découvrez une sélection de recettes cosmétiques adaptées à vos besoins.",
  twitterImage: "/purecare-logo.jpg",
});

definePageMeta({
  middleware: "not-auth",
});
</script>

<template>
  <div
    class="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
      <h2
        class="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
      >
        Je m'inscris
      </h2>
      <span>ou </span
      ><NuxtLink to="/login" class="font-bold hover:text-gray-600"
        >je me connecte</NuxtLink
      >
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
      <div class="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
        <form class="space-y-6" @submit.prevent="createUser">
          <div>
            <label
              for="email"
              class="block text-sm font-medium leading-6 text-gray-900"
              >Email</label
            >
            <div class="mt-2">
              <input
                v-model="userEmail"
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required=""
                class="block w-full rounded-md border border-1 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              for="password"
              class="block text-sm font-medium leading-6 text-gray-900"
              >Mot de passe</label
            >
            <div class="mt-2">
              <input
                v-model="userPassword"
                id="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required=""
                class="block w-full rounded-md border border-1 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              for="confirmPassword"
              class="block text-sm font-medium leading-6 text-gray-900"
              >Confirmer le mot de passe</label
            >
            <div class="mt-2">
              <input
                v-model="userConfirmPassword"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autocomplete="confirm-password"
                required=""
                class="block w-full rounded-md border border-1 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
              />
            </div>
            <p v-if="showErrorMessage" class="text-red-500 text-sm mt-2">
              {{ errorMessage }}
            </p>
          </div>

          <div>
            <button
              class="flex w-full justify-center rounded-md bg-[#F3B8B4] px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm hover:bg-[#F19B95]"
            >
              Je m'inscris
            </button>
          </div>
        </form>

        <div>
          <div class="relative mt-10">
            <div class="absolute inset-0 flex items-center" aria-hidden="true">
              <div class="w-full border-t border-gray-200" />
            </div>
            <div
              class="relative flex justify-center text-sm font-medium leading-6"
            >
              <span class="bg-white px-6 text-gray-900">Ou continuer avec</span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-4">
            <button
              @click="loginWithGoogle"
              class="flex w-full hover:border-[#db4a39] hover:border-2 items-center justify-center gap-3 rounded-md border px-3 py-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D9BF0]"
            >
              <GoogleIcon />
              <span class="text-sm font-semibold leading-6">Google</span>
            </button>

            <button
              @click="loginWithFacebook"
              class="flex w-full hover:border-[#0a80ec] hover:border-2 items-center justify-center gap-3 rounded-md border px-3 py-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F]"
            >
              <FacebookIcon />
              <span class="text-sm font-semibold leading-6">Facebook</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
