import { fetchUserBeautyProfile, checkUserAuthentication } from "@/utils.js";

function isbeautyProfileCompleted() {
  if (process.client) {
    const strOfHairProblemId = localStorage.getItem("hairProblem");
    const strOfSkinProblemId = localStorage.getItem("skinProblem");
    const skinTypeId = localStorage.getItem("skinType");
    const hairTypeId = localStorage.getItem("hairType");
    const quizCompleted =
      strOfHairProblemId && strOfSkinProblemId && skinTypeId && hairTypeId;
    return quizCompleted;
  }
}

export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = await checkUserAuthentication();
  const hasBeautyProfile = await fetchUserBeautyProfile(user);
  if (!isbeautyProfileCompleted() && !user && !hasBeautyProfile) {
    return navigateTo("/profil-beaute");
  }
});
