import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { handleAuthError, jsonError } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const ownerId = request.nextUrl.searchParams.get("ownerId");

    if (session.role === "ADMIN" && ownerId) {
      const pets = await prisma.pet.findMany({
        where: { ownerId },
        include: { owner: { select: { id: true, name: true, email: true } } },
        orderBy: { name: "asc" },
      });
      return NextResponse.json(pets);
    }

    const pets = await prisma.pet.findMany({
      where: { ownerId: session.id },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(pets);
  } catch (error) {
    const authError = handleAuthError(error);
    if (authError) return authError;
    return jsonError("Помилка завантаження", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const { name, species, breed, age, ownerId } = await request.json();

    if (!name || !species) {
      return jsonError("Заповніть обов'язкові поля", 400);
    }

    const pet = await prisma.pet.create({
      data: {
        name,
        species,
        breed,
        age: age ? Number(age) : null,
        ownerId: session.role === "ADMIN" && ownerId ? ownerId : session.id,
      },
    });

    return NextResponse.json(pet, { status: 201 });
  } catch (error) {
    const authError = handleAuthError(error);
    if (authError) return authError;
    return jsonError("Помилка створення", 500);
  }
}
