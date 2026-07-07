import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { toggleLike } from "@/lib/likes";
import type { LikeTargetType } from "@prisma/client";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in to like content." }, { status: 401 });
  }

  const { type, targetId } = (await req.json()) as { type: LikeTargetType; targetId: string };
  if (!type || !targetId) {
    return NextResponse.json({ error: "Missing type or targetId." }, { status: 400 });
  }

  const result = await toggleLike(session.user.id, type, targetId);
  return NextResponse.json(result);
}
