"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import {
  updateUserProfileSchema,
  UpdateUserProfileValues,
} from "@/lib/validation";

export async function updateUserProfile(values: UpdateUserProfileValues) {
    // validate the values (bio and display name )
    // we do this becore validateRequest() , no need for a db request if values are not validated
  const validatedValues = updateUserProfileSchema.parse(values); 

  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: validatedValues,
    select: getUserDataSelect(user.id),
  });

  return updatedUser;
}