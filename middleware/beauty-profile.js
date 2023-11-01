import { fetchUserBeautyProfile } from "@/utils.js";

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
  const token = useCookie("token");
  const hasBeautyProfile = await fetchUserBeautyProfile(token.value);

  if (!isbeautyProfileCompleted() && !token.value && !hasBeautyProfile) {
    return navigateTo("/profil-beaute");
  }
});
