import { fetchUserBeautyProfile, checkUserAuthentication } from "@/utils.js";

function isbeautyProfileCompleted(user, hasBeautyProfile) {
  if (process.client) {
    const strOfHairProblemId = localStorage.getItem("hairProblem");
    const strOfSkinProblemId = localStorage.getItem("skinProblem");
    const skinTypeId = localStorage.getItem("skinType");
    const hairTypeId = localStorage.getItem("hairType");
    const quizCompleted =
      strOfHairProblemId && strOfSkinProblemId && skinTypeId && hairTypeId;
    return quizCompleted || (user && hasBeautyProfile);
  }
}

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { $auth } = useNuxtApp();
  const hasBeautyProfile = await fetchUserBeautyProfile(
    $auth?.currentUser?.uid
  );
  if (isbeautyProfileCompleted($auth?.currentUser?.uid, hasBeautyProfile)) {
    return navigateTo("/");
  }
});
