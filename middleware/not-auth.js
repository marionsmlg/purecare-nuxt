import { checkUserAuthentication } from "@/utils.js";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = await checkUserAuthentication();

  if (user) {
    return navigateTo("/mes-recettes");
  }
});
