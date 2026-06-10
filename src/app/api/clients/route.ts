import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { handleAuthError, jsonError } from "@/lib/api-utils";

export async function GET() {
  try {
    await requireAuth(["ADMIN"]);

    const clients = await prisma.user.findMany({
      where: { role: "CLIENT" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        _count: { select: { pets: true, appointments: true } },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(clients);
  } catch (error) {
    const authError = handleAuthError(error);
    if (authError) return authError;
    return jsonError("Помилка завантаження", 500);
  }
}
