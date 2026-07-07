import { prisma } from "@/lib/prisma";
import type { LikeTargetType } from "@prisma/client";

/**
 * Like is a polymorphic association (see prisma/schema.prisma comment on the
 * Like model). These helpers centralize toggling + counting so no route has
 * to reimplement the discriminator logic.
 */

export async function toggleLike(userId: string, type: LikeTargetType, targetId: string) {
  const existing = await prisma.like.findUnique({
    where: { userId_type_targetId: { userId, type, targetId } },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    return { liked: false };
  }

  await prisma.like.create({ data: { userId, type, targetId } });
  return { liked: true };
}

export async function countLikes(type: LikeTargetType, targetId: string) {
  return prisma.like.count({ where: { type, targetId } });
}

export async function userHasLiked(userId: string, type: LikeTargetType, targetId: string) {
  const existing = await prisma.like.findUnique({
    where: { userId_type_targetId: { userId, type, targetId } },
  });
  return Boolean(existing);
}
