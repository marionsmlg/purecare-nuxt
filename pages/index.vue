<script setup>
import CompositionCosmetics from "../components/landing-page/CompositionCosmetics.vue";
import UniqueProducts from "../components/landing-page/UniqueProducts.vue";
import SaveMoney from "../components/landing-page/SaveMoney.vue";
import WomanWondering from "../components/landing-page/WomanWondering.vue";
import Products from "../components/landing-page/Products.vue";
import { ArrowLongRightIcon } from "@heroicons/vue/20/solid";
import ButtonPrimary from "../components/buttons/ButtonPrimary.vue";
import IconPeople from "../components/icons/IconPeople.vue";
import IconMolecule from "../components/icons/IconMolecule.vue";
import { onAuthStateChanged } from "firebase/auth";
import { ref } from "vue";
import QuickResearchRecipes from "../components/QuickResearchRecipes.vue";

const { $auth } = useNuxtApp();

function resetLocalStorage() {
  if (process.client) {
    localStorage.clear();
  }
  const beautyProfile = useCookie("beautyProfile");
  beautyProfile.value = null;
}
resetLocalStorage();

const mainButtonRoute = ref("");

onAuthStateChanged($auth, (user) => {
  if (user) {
    mainButtonRoute.value = "/mes-recettes";
  } else {
    mainButtonRoute.value = "/profil-beaute";
  }
});

const argumentsList = [
  {
    title: "Evitez les ingrédients nocifs, priviligiez le fait maison",
    img: CompositionCosmetics,
    content:
      "Ayez un contrôle total sur les ingrédients utilisés, optant ainsi pour des ingrédients naturels, biologiques et adaptés à votre type de peau.",
  },
  {
    title: "Créez des produits uniques !",
    img: UniqueProducts,
    content:
      "Grâce à notre questionnaire, nous sélectionnons des recettes de cosmétiques qui répondent à vos besoins spécifiques afin d'obtenir des produits uniques qui vous conviennent parfaitement.",
  },
  {
    title: "Economisez sur le long terme",
    img: SaveMoney,
    content:
      "Grâce à nos recettes à base d'ingrédients abordables, vous pouvez obtenir des résultats similaires à ceux des produits cosmétiques commerciaux, tout en réalisant des économies significatives.",
  },
];

useSeoMeta({
  title: "PureCare : des soins sains pour une beauté durable",
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
</script>

<template>
  <div class="xl:max-w-7xl 2xl:m-auto md:m-6">
    <section class="my-4 mt-12">
      <div class="text-center flex flex-col items-center">
        <div class="px-6">
          <h1
            class="text-[#605E5E] text-xl font-medium mb-3 md:text-2xl lg:text-4xl"
          >
            Vous cherchez une recette cosmétique adaptée à
            <span class="text-cyan-500">vous</span> ?
          </h1>
          <h2 class="text-[#605E5E] md:text-xl lg:text-2xl lg:mb-12">
            PureCare sélectionne des recettes de cosmétiques DIY qui vous
            ressemblent !
          </h2>
          <!-- <div class="hidden lg:flex justify-center">
            <NuxtLink :to="mainButtonRoute"
              ><ButtonPrimary
                >Découvrez vos recettes sur mesure
                <ArrowLongRightIcon class="w-4 h-4 ml-2" /></ButtonPrimary
            ></NuxtLink>
          </div> -->
        </div>

        <WomanWondering class="max-w-5xl md:rounded-md mb-4" />

        <div class="flex justify-center p-2">
          <NuxtLink :to="mainButtonRoute"
            ><ButtonPrimary
              >Découvrez vos recettes sur mesure
              <ArrowLongRightIcon class="w-4 h-4 ml-2" /></ButtonPrimary
          ></NuxtLink>
        </div>
      </div>
    </section>

    <QuickResearchRecipes />

    <div
      class="py-8 bg-gradient-to-b from-[#FBDFDB] to-[#C7E8F1] md:hidden"
    ></div>

    <section class="md:my-8 flex flex-col lg:flex-row">
      <div
        class="text-center bg-[#C7E8F1] lg:mr-6 lg:mb-0 md:mb-6 py-12 px-10 md:rounded-xl flex flex-col md:flex-row items-center lg:w-1/2"
      >
        <div class="flex w-2/5 justify-center"><IconMolecule /></div>
        <div class="md:w-4/5">
          <h2 class="font-semibold mb-4 lg:text-xl">
            Une composition douteuse ?
          </h2>
          <p class="lg:text-lg">
            De nombreux produits cosmétiques contiennent des ingrédients
            potentiellement nocifs tels que les parabènes, sulfates et
            phtalates, pouvant être irritants pour la peau et avoir des effets
            néfastes à long terme.
          </p>
        </div>
      </div>
      <div
        class="py-8 bg-gradient-to-b from-[#C7E8F1] to-white md:hidden"
      ></div>
      <div
        class="text-center py-12 px-10 md:rounded-xl md:border flex flex-col md:flex-row items-center lg:w-1/2"
      >
        <div class="flex w-2/5 justify-center"><IconPeople /></div>
        <div class="md:w-4/5">
          <h2 class="font-semibold mb-4 lg:text-xl">
            Des produits trop génériques ?
          </h2>
          <p class="lg:text-lg">
            Les cosmétiques commerciaux ne sont pas adaptés à vos besoins
            individuels, car ils sont fabriqués en masse pour répondre à une
            grande variété de consommateurs.
          </p>
        </div>
      </div>
    </section>

    <div class="bg-[#FBDFDB] py-6 px-6 text-center md:rounded-lg">
      <h1 class="text-xl font-semibold md:text-2xl lg:text-3xl">
        PureCare vous recommande des recettes de cosmétiques qui vous
        ressemblent !
      </h1>
    </div>

    <ul class="mx-8 pb-8 border border-transparent border-b-gray-200">
      <li
        v-for="(argument, index) in argumentsList"
        class="flex flex-col items-center md:flex-row my-8"
      >
        <div
          :class="
            index === 1
              ? 'order-none md:order-1 md:w-2/4 flex md:justify-center md:ml-8'
              : 'order-none md:w-2/4 flex md:justify-center'
          "
        >
          <component
            :is="argument.img"
            alt="argument"
            :class="[
              index === 0 ? 'w-full' : '',
              index === 1 ? 'md:w-72 w-60' : '',
              index === 2 ? 'md:w-56 w-40' : '',
            ]"
          />
        </div>
        <div class="text-center md:w-2/4 md:ml-8">
          <h2 class="font-semibold mb-4 mt-4 lg:text-2xl">
            {{ argument.title }}
          </h2>
          <p class="text-sm lg:text-lg">
            {{ argument.content }}
          </p>
        </div>
      </li>
    </ul>

    <div class="my-4 flex justify-center">
      <div class="absolute flex flex-col items-center">
        <h1
          class="text-center text-[#605E5E] font-semibold mx-4 mt- md:mt-10 md:text-xl lg:text-2xl pb-20 z-10"
        >
          Pour plus de personnalisation, créez votre profil beauté et obtenez
          une sélection de recettes adaptées à vous !
        </h1>
        <div class="z-10 p-2">
          <NuxtLink :to="mainButtonRoute"
            ><ButtonPrimary
              >Découvrez vos recettes sur mesure
              <ArrowLongRightIcon class="w-4 h-4 ml-2" /></ButtonPrimary
          ></NuxtLink>
        </div>
      </div>

      <div class="flex inline-block w-full md:justify-center mt-12">
        <Products
          alt="Votre image"
          class="flex w-full md:max-w-xl opacity-60"
        />
      </div>
    </div>
  </div>
</template>
