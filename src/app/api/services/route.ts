import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { handleAuthError, jsonError } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  const admin = request.nextUrl.searchParams.get("all") === "true";
  const services = await prisma.service.findMany({
    where: admin ? {} : { isActive: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(services);
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth(["ADMIN"]);
    const { name, description, duration, price, isActive } =
      await request.json();

    if (!name || !duration || price === undefined) {
      return jsonError("Заповніть обов'язкові поля", 400);
    }

    const service = await prisma.service.create({
      data: {
        name,
        description,
        duration: Number(duration),
        price: Number(price),
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    const authError = handleAuthError(error);
    if (authError) return authError;
    return jsonError("Помилка створення послуги", 500);
  }
}
