import { checkUserAuthentication } from "@/utils.js";

const user = await checkUserAuthentication();

export default defineNuxtRouteMiddleware((to, from) => {
  if (user) {
    return navigateTo("/mes-recettes");
  }
});
