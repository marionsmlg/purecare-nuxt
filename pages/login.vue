<script setup>
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import { ref, computed } from "vue";
import { fetchUserBeautyProfile } from "@/utils.js";
import FacebookIcon from "@/components/icons/SocialMedia/facebook.vue";
import GoogleIcon from "@/components/icons/SocialMedia/google.vue";

const { $auth } = useNuxtApp();

const userEmail = ref();
const userPassword = ref();

const router = useRouter();

async function loginWithFacebook() {
  const provider = new FacebookAuthProvider();
  try {
    const result = await signInWithPopup($auth, provider);
    const user = result.user;
    const token = useCookie("token");
    token.value = await user.getIdToken();

    const hasBeautyProfile = await fetchUserBeautyProfile(
      await user.getIdToken()
    );
    if (hasBeautyProfile) {
      router.push("/mes-recettes");
    } else {
      router.push("/profil-beaute");
    }
  } catch (error) {
    // Gérez les erreurs ici
  }
}

async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup($auth, provider);
    const user = result.user;
    const token = useCookie("token");
    token.value = await user.getIdToken();
    const hasBeautyProfile = await fetchUserBeautyProfile(
      await user.getIdToken()
    );
    if (hasBeautyProfile) {
      router.push("/mes-recettes");
    } else {
      router.push("/profil-beaute");
    }
  } catch (error) {
    // Gérez les erreurs ici
  }
}

const showErrorMessage = ref(false);
const errorMessage = ref("");

const loginUser = computed(() => {
  signInWithEmailAndPassword($auth, userEmail.value, userPassword.value)
    .then(async (userCredential) => {
      const user = userCredential.user;
      const token = useCookie("token"); // useCookie new hook in nuxt 3
      token.value = await user.getIdToken();
      router.push("/mes-recettes");
    })
    .catch((error) => {
      const errorCode = error.code;
      showErrorMessage.value = true;
      if (errorCode === "auth/invalid-login-credentials") {
        errorMessage.value = "Les idendifiants sont incorrects.";
      }
    });
});

// async function forgotPassword() {
//   await sendPasswordResetEmail($auth, 'marion.schimmerling@hotmail.fr')
// }

useSeoMeta({
  title: "Se connecter - PureCare",
  ogTitle: "Se connecter - PureCare",
  description:
    "Découvrez une sélection de recettes cosmétiques adaptées à vos besoins.",
  ogDescription:
    "Découvrez une sélection de recettes cosmétiques adaptées à vos besoins.",
  ogImage: "/purecare-logo.jpg",
  twitterCard: "summary_large_image",
  twitterTitle: "Se connecter - PureCare",
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
        Je me connecte
      </h2>
      <span>ou </span
      ><NuxtLink to="/sign-up" class="font-bold hover:text-gray-600"
        >je m'inscris</NuxtLink
      >
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
      <div class="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
        <form @submit.prevent="loginUser" class="space-y-6">
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

          <!-- <div class="flex items-center justify-between">
            <div class="text-sm leading-6">
              <button
                @click="forgotPassword"
                class="font-semibold text-gray-600 hover:text-gray-500"
              >
                Mot de passe oublié ?
              </button>
            </div>
          </div> -->
          <p v-if="showErrorMessage" class="text-red-500 text-sm">
            {{ errorMessage }}
          </p>
          <div>
            <button
              type="submit"
              class="flex w-full justify-center rounded-md bg-[#F3B8B4] px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm hover:bg-[#F19B95]"
            >
              Je me connecte
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
