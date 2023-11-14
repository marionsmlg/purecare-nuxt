import IconOilySkin from "@/components/icons/skin-types/IconOilySkin.vue";
import IconDrySkin from "@/components/icons/skin-types/IconDrySkin.vue";
import IconNormalSkin from "@/components/icons/skin-types/IconNormalSkin.vue";
import IconMixedSkin from "@/components/icons/skin-types/IconMixedSkin.vue";
import IconSmoothHair from "@/components/icons/hair-types/IconSmoothHair.vue";
import IconFrizzyHair from "@/components/icons/hair-types/IconFrizzyHair.vue";
import IconWavyHair from "@/components/icons/hair-types/IconWavyHair.vue";
import IconCurlyHair from "@/components/icons/hair-types/IconCurlyHair.vue";
import { markRaw } from "vue";

export function addIcon(objectWithoutIcon) {
  const arrOfIcons = [
    {
      name: "Sèche",
      icon: markRaw(IconDrySkin),
    },
    {
      name: "Grasse",
      icon: markRaw(IconOilySkin),
    },
    {
      name: "Mixte",
      icon: markRaw(IconMixedSkin),
    },
    {
      name: "Normale",
      icon: markRaw(IconNormalSkin),
    },
    { name: "Lisses", icon: markRaw(IconSmoothHair) },
    { name: "Ondulés", icon: markRaw(IconWavyHair) },
    { name: "Bouclés", icon: markRaw(IconCurlyHair) },
    { name: "Frisées / Crépus", icon: markRaw(IconFrizzyHair) },
  ];

  if (Array.isArray(objectWithoutIcon)) {
    for (const objet of objectWithoutIcon) {
      const correspondingIcon = arrOfIcons.find(
        (icon) => icon.name === objet.name
      );

      if (correspondingIcon) {
        objet.icon = correspondingIcon.icon;
      }
    }
  } else {
    const correspondingIcon = arrOfIcons.find(
      (icon) => icon.name === objectWithoutIcon.name
    );
    if (correspondingIcon) {
      objectWithoutIcon.icon = correspondingIcon.icon;
    }
  }
}

export function capitalizeFirstLetter(str) {
  if (str.length === 0) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function pushObjectValueInNewArr(arrOfobject) {
  const newArr = [];
  for (const object of arrOfobject) {
    const arrOfkey = Object.keys(object);
    const key = arrOfkey[0];
    newArr.push(object[key]);
  }
  return newArr;
}
