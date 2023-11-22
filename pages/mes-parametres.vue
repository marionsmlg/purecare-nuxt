<script setup>
import { ref } from "vue";
import {
  onAuthStateChanged,
  updateEmail,
  deleteUser,
  sendEmailVerification,
} from "firebase/auth";

import FacebookIcon from "../components/icons/social-media/facebook.vue";
import GoogleIcon from "../components/icons/social-media/google.vue";
import NoIcon from "../components/icons/NoIcon.vue";

const router = useRouter();
const { $auth } = useNuxtApp();

const newUserEmail = ref("");
const providerId = ref("");
const provider = ref(null);

onAuthStateChanged($auth, (user) => {
  if (user) {
    newUserEmail.value = user.email;
    providerId.value = user.providerData[0].providerId;
    if (providerId.value.endsWith(".com")) {
      provider.value = providerId.value.split(".com").join("");
    }
  } else {
  }
});

async function updateUserEmail() {
  updateEmail($auth.currentUser, newUserEmail.value)
    .then(() => {
      console.log("l'email a bien ete modifie !");
    })
    .catch((error) => {
      console.error(error);
    });
}
async function clearTokenAndRedirect() {
  return new Promise((resolve) => {
    const token = useCookie("token");
    token.value = null;
    const interval = setInterval(() => {
      if (!token.value) {
        clearInterval(interval);
        resolve();
      }
    }, 100);
  }).then(() => {
    return router.push("/");
  });
}

async function deleteCurrentUser() {
  const user = $auth.currentUser;
  try {
    await deleteData(`${apiUrl}/api/v1/users`);
    await deleteUser(user);
    await clearTokenAndRedirect();
  } catch (error) {
    console.error(error);
  }
}

async function verifyEmail() {
  await sendEmailVerification($auth.currentUser);
  console.log("email sent");
}

useSeoMeta({
  title: "Mes paramètres",
  ogTitle: "PureCare : des soins sains pour une beauté durable",
  description:
    "Découvrez une sélection de recettes cosmétiques adaptées à vos besoins.",
  ogDescription:
    "Découvrez une sélection de recettes cosmétiques adaptées à vos besoins.",
  ogImage: "/purecare-logo.jpg",
  twitterCard: "summary_large_image",
  twitterTitle: "PureCare : des soins sains pour une beauté durable",
  twitterDescription:
    "Découvrez une sélection de recettes cosmétiques adaptées à vos besoins.",
  twitterImage: "/purecare-logo.jpg",
});

definePageMeta({
  middleware: "user-beauty-profile",
});
</script>

<template>
  <div v-if="providerId !== 'password'" class="divide-y divide-white/5">
    <div
      class="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 lg:pb-36 sm:px-6 md:grid-cols-3 lg:px-8"
    >
      <h2 class="text-base font-semibold leading-7">
        Informations personelles
      </h2>

      <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
        <div class="col-span-full flex items-center gap-x-4">
          <div class="min-w-fit">
            <component
              :is="
                provider === 'google'
                  ? GoogleIcon
                  : provider === 'facebook'
                  ? FacebookIcon
                  : NoIcon
              "
              class="w-6 h-6"
            />
          </div>

          <p class="text-sm leading-5 font-semibold text-gray-600">
            Vous êtes connecté avec
            <span class="capitalize">{{ provider }}</span>
          </p>
        </div>

        <div class="col-span-full">
          <label for="email" class="block text-sm font-medium leading-6"
            >Adresse e-mail</label
          >
          <div class="mt-2">
            <div
              class="block w-full max-w-fit px-2 rounded-md border border-1 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
            >
              {{ newUserEmail }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8"
    >
      <div>
        <h2 class="text-base font-semibold leading-7">Supprimer le compte</h2>
        <p class="mt-1 text-sm leading-6 text-gray-400">
          Vous ne souhaitez plus utiliser nos services ? Vous pouvez supprimer
          votre compte ici. Cette action n'est pas réversible. Toutes les
          informations relatives à ce compte seront définitivement supprimées.
        </p>
      </div>

      <form
        class="flex items-start md:col-span-2"
        @submit.prevent="deleteCurrentUser"
      >
        <button
          type="submit"
          class="rounded-xl bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400"
        >
          Supprimer mon compte
        </button>
      </form>
    </div>
  </div>

  <div v-else class="xl:pl-72">
    <div class="divide-y divide-white/5">
      <div
        class="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8"
      >
        <div>
          <h2 class="text-base font-semibold leading-7">
            Informations personelles
          </h2>
          <!-- <p class="mt-1 text-sm leading-6 text-gray-400">
            Utilisez une adresse permanente où vous pouvez recevoir un e-mail.
          </p> -->
        </div>

        <form class="md:col-span-2" @submit.prevent="verifyEmail">
          <div
            class="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6"
          >
            <div class="col-span-full">
              <label for="email" class="block text-sm font-medium leading-6"
                >Adresse e-mail</label
              >
              <div class="mt-2">
                <input
                  v-model="newUserEmail"
                  id="email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  disabled
                  class="block w-full rounded-md border border-1 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>

          <!-- <div class="mt-8 flex">
            <button
              type="submit"
              class="rounded-xl bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Sauvegarder
            </button>
          </div> -->
        </form>
      </div>

      <div
        class="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8"
      >
        <div>
          <h2 class="text-base font-semibold leading-7">
            Modifier le mot de passe
          </h2>
          <p class="mt-1 text-sm leading-6 text-gray-400">
            Mettez à jour votre mot de passe associé à votre compte.
          </p>
        </div>

        <form class="md:col-span-2">
          <div
            class="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6"
          >
            <div class="col-span-full">
              <label
                for="current-password"
                class="block text-sm font-medium leading-6"
                >Mot de passe actuel</label
              >
              <div class="mt-2">
                <input
                  id="current-password"
                  name="current_password"
                  type="password"
                  autocomplete="current-password"
                  class="block w-full rounded-md border border-1 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div class="col-span-full">
              <label
                for="new-password"
                class="block text-sm font-medium leading-6"
                >Nouveau mot de passe</label
              >
              <div class="mt-2">
                <input
                  id="new-password"
                  name="new_password"
                  type="password"
                  autocomplete="new-password"
                  class="block w-full rounded-md border border-1 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div class="col-span-full">
              <label
                for="confirm-password"
                class="block text-sm font-medium leading-6"
                >Confirmer le mot de passe</label
              >
              <div class="mt-2">
                <input
                  id="confirm-password"
                  name="confirm_password"
                  type="password"
                  autocomplete="new-password"
                  class="block w-full rounded-md border border-1 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>

          <div class="mt-8 flex">
            <button
              type="submit"
              class="rounded-xl bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Sauvegarder
            </button>
          </div>
        </form>
      </div>

      <div
        class="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8"
      >
        <div>
          <h2 class="text-base font-semibold leading-7">Supprimer le compte</h2>
          <p class="mt-1 text-sm leading-6 text-gray-400">
            Vous ne souhaitez plus utiliser nos services ? Vous pouvez supprimer
            votre compte ici. Cette action n'est pas réversible. Toutes les
            informations relatives à ce compte seront définitivement supprimées.
          </p>
        </div>

        <form
          class="flex items-start md:col-span-2"
          @submit.prevent="deleteCurrentUser"
        >
          <button
            type="submit"
            class="rounded-xl bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400"
          >
            Supprimer mon compte
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
