import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { handleAuthError, jsonError } from "@/lib/api-utils";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const data = await request.json();

    const pet = await prisma.pet.findUnique({ where: { id } });
    if (!pet) return jsonError("Тварину не знайдено", 404);
    if (session.role !== "ADMIN" && pet.ownerId !== session.id) {
      return jsonError("Недостатньо прав", 403);
    }

    const updated = await prisma.pet.update({
      where: { id },
      data: {
        name: data.name,
        species: data.species,
        breed: data.breed,
        age: data.age !== undefined ? Number(data.age) : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    const authError = handleAuthError(error);
    if (authError) return authError;
    return jsonError("Помилка оновлення", 500);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const pet = await prisma.pet.findUnique({ where: { id } });
    if (!pet) return jsonError("Тварину не знайдено", 404);
    if (session.role !== "ADMIN" && pet.ownerId !== session.id) {
      return jsonError("Недостатньо прав", 403);
    }

    await prisma.pet.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    const authError = handleAuthError(error);
    if (authError) return authError;
    return jsonError("Помилка видалення", 500);
  }
}
