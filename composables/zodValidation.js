import { z } from "zod";

export function uuidIsValid(uuid) {
  const uuidSchema = z.string().uuid({ message: "Invalid UUID" });
  return uuidSchema.safeParse(uuid).success;
}

export function uidFirebaseValid(uidFirebase) {
  const uidSchema = z
    .string()
    .refine((value) => /^[a-zA-Z0-9]{28}$/.test(value), {
      message: "L'UID Firebase n'est pas valide.",
    });
  const result = uidSchema.safeParse(uidFirebase);
  if (result.success) {
    return result.data;
  } else {
    return null;
  }
}
