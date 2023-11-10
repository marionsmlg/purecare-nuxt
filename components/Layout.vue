<script setup>
import {
  UserIcon,
  IdentificationIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  PencilSquareIcon,
  CogIcon,
} from "@heroicons/vue/24/outline";

import PurecareLogo from "@/components/PurecareLogo.vue";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref } from "vue";

const { $auth } = useNuxtApp();

const isUserLoggedIn = ref(false);

onAuthStateChanged($auth, async (user) => {
  if (user) {
    isUserLoggedIn.value = true;
  } else {
    isUserLoggedIn.value = false;
  }
});

const router = useRouter();
function clearTokenAndRedirect() {
  return new Promise((resolve, reject) => {
    const token = useCookie("token"); // Assurez-vous d'importer et d'utiliser correctement votre bibliothèque de cookies

    // Définir la valeur du cookie à null
    token.value = null;

    // Rediriger l'utilisateur vers la page d'accueil ("/") après avoir effacé le cookie

    resolve(); // La promesse est résolue après la redirection réussie
  });
}

const token = useCookie("token");
function signOutUser() {
  signOut($auth)
    .then(() => {
      router.push("/logout");
    })
    .catch((error) => {
      console.log(error);
    });
}
</script>

<template>
  <nav>
    <div class="flex justify-between items-center px-7 py-4 shadow-md">
      <div class="w-40 md:w-44">
        <NuxtLink to="/"><PurecareLogo /></NuxtLink>
      </div>

      <!-- <div class="hidden lg:flex md:text-left text-gray-700">
        <NuxtLink to="/login" class="px-10">Se connecter</NuxtLink>
        <NuxtLink to="/sign-up" class="font-bold">S'inscrire</NuxtLink>
      </div> -->

      <!-- //////////////////////////// -->

      <div v-if="isUserLoggedIn" class="w-56 text-right">
        <Menu as="div" class="relative inline-block text-left">
          <div>
            <MenuButton
              class="inline-flex w-full justify-center rounded-md text-sm font-medium text-gray-700 hover:text-gray-500"
            >
              <UserIcon class="w-5" />
            </MenuButton>
          </div>

          <transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <MenuItems
              class="z-10 absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <div class="px-1 py-1">
                <MenuItem v-slot="{ active, close }" as="div">
                  <NuxtLink
                    @click="close"
                    to="/mes-recettes"
                    :class="[
                      active ? 'bg-[#C7E8F1]' : 'text-gray-900',
                      'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                    ]"
                  >
                    <UserIcon
                      :active="active"
                      class="mr-2 h-5 w-5 text-[#0C8294]"
                      aria-hidden="true"
                    />
                    Mes recettes
                  </NuxtLink>
                </MenuItem>
                <MenuItem v-slot="{ active, close }" as="div">
                  <NuxtLink
                    @click="close"
                    to="/mon-profil-beaute"
                    :class="[
                      active ? 'bg-[#C7E8F1]' : 'text-gray-900',
                      'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                    ]"
                  >
                    <IdentificationIcon
                      :active="active"
                      class="mr-2 h-5 w-5 text-[#0C8294]"
                      aria-hidden="true"
                    />
                    Mon profil
                  </NuxtLink>
                </MenuItem>
                <MenuItem v-slot="{ active, close }" as="div">
                  <NuxtLink
                    @click="close"
                    to="/mes-parametres"
                    :class="[
                      active ? 'bg-[#C7E8F1]' : 'text-gray-900',
                      'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                    ]"
                  >
                    <CogIcon
                      :active="active"
                      class="mr-2 h-5 w-5 text-[#0C8294]"
                      aria-hidden="true"
                    />
                    Mes paramètres
                  </NuxtLink>
                </MenuItem>
              </div>
              <div class="px-1 py-1">
                <MenuItem v-slot="{ active }" as="div">
                  <button
                    @click="signOutUser"
                    :class="[
                      active ? 'bg-[#C7E8F1]' : 'text-gray-900',
                      'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                    ]"
                  >
                    <ArrowRightOnRectangleIcon
                      :active="active"
                      class="mr-2 h-5 w-5 text-[#0C8294]"
                      aria-hidden="true"
                    />
                    Se déconnecter
                  </button>
                </MenuItem>
              </div>
            </MenuItems>
          </transition>
        </Menu>
      </div>

      <!-- /////////////////////////////// -->

      <div v-else class="w-56 text-right">
        <Menu as="div" class="relative inline-block text-left">
          <div>
            <MenuButton
              class="inline-flex w-full justify-center rounded-md text-sm font-medium text-gray-700 hover:text-gray-500"
            >
              <UserIcon class="w-5" />
            </MenuButton>
          </div>

          <transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <MenuItems
              class="z-10 absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <div class="px-1 py-1">
                <MenuItem v-slot="{ active, close }" as="div">
                  <NuxtLink
                    @click="close"
                    to="/login"
                    :class="[
                      active ? 'bg-[#C7E8F1]' : 'text-gray-900',
                      'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                    ]"
                  >
                    <ArrowLeftOnRectangleIcon
                      :active="active"
                      class="mr-2 h-5 w-5 text-[#0C8294]"
                      aria-hidden="true"
                    />
                    Se connecter
                  </NuxtLink>
                </MenuItem>
              </div>
              <div class="px-1 py-1">
                <MenuItem v-slot="{ active, close }" as="div">
                  <NuxtLink
                    @click="close"
                    to="/sign-up"
                    :class="[
                      active ? 'bg-[#C7E8F1]' : 'text-gray-900',
                      'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                    ]"
                  >
                    <PencilSquareIcon
                      :active="active"
                      class="mr-2 h-5 w-5 text-[#0C8294]"
                      aria-hidden="true"
                    />
                    S'inscrire
                  </NuxtLink>
                </MenuItem>
              </div>
            </MenuItems>
          </transition>
        </Menu>
      </div>
    </div>
  </nav>
</template>
