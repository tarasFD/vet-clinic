import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { handleAuthError, jsonError } from "@/lib/api-utils";

export async function GET() {
  const clinic = await prisma.clinicInfo.findUnique({
    where: { id: "default" },
  });
  return NextResponse.json(clinic);
}

export async function PUT(request: Request) {
  try {
    await requireAuth(["ADMIN"]);
    const data = await request.json();

    const clinic = await prisma.clinicInfo.upsert({
      where: { id: "default" },
      update: data,
      create: { id: "default", ...data },
    });

    return NextResponse.json(clinic);
  } catch (error) {
    const authError = handleAuthError(error);
    if (authError) return authError;
    return jsonError("Помилка оновлення", 500);
  }
}
