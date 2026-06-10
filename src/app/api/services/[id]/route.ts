import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { handleAuthError, jsonError } from "@/lib/api-utils";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth(["ADMIN"]);
    const { id } = await params;
    const data = await request.json();

    const service = await prisma.service.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        duration:
          data.duration !== undefined ? Number(data.duration) : undefined,
        price: data.price !== undefined ? Number(data.price) : undefined,
        isActive: data.isActive,
      },
    });

    return NextResponse.json(service);
  } catch (error) {
    const authError = handleAuthError(error);
    if (authError) return authError;
    return jsonError("Помилка оновлення послуги", 500);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth(["ADMIN"]);
    const { id } = await params;

    await prisma.service.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const authError = handleAuthError(error);
    if (authError) return authError;
    return jsonError("Помилка видалення послуги", 500);
  }
}
