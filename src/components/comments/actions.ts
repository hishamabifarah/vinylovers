"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getCommentDataInclude, VinylData } from "@/lib/types";
import { createCommentSchema } from "@/lib/validation";

export async function submitComment({
  vinyl, // pass whole vinyl object because we need author of the vinyl when creating notifications
  content,
}: {
  vinyl: VinylData;
  content: string;
}) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const { content: contentValidated } = createCommentSchema.parse({ content });

  // const newComment = await prisma.comment.create({
  //   data: {
  //     content: contentValidated,
  //     vinylId: vinyl.id,
  //     userId: user.id,
  //   },
  //   include: getCommentDataInclude(user.id),
  // });

  const [newComment] = await prisma.$transaction([
    prisma.comment.create({
      data: {
        content: contentValidated,
        vinylId: vinyl.id,
        userId: user.id,
      },
      include: getCommentDataInclude(user.id),
    }),
    ...(vinyl.user.id !== user.id
      ? [
          prisma.notification.create({
            data: {
              issuerId: user.id,
              recipientId: vinyl.user.id,
              vinylId: vinyl.id,
              type: "COMMENT",
            },
          }),
        ]
      : []),
  ]);

  return newComment;
}

export async function deleteComment(id: string) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const comment = await prisma.comment.findUnique({
    where: { id },
  });

  if (!comment) throw new Error("Comment not found");

  if (comment.userId !== user.id) throw new Error("Unauthorized");

  const deletedComment = await prisma.comment.delete({
    where: { id },
    include: getCommentDataInclude(user.id),
  });

  return deletedComment;
}