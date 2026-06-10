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
    const { status, notes, dateTime } = await request.json();

    const appointment = await prisma.appointment.findUnique({ where: { id } });
    if (!appointment) return jsonError("Запис не знайдено", 404);

    if (session.role !== "ADMIN" && appointment.clientId !== session.id) {
      return jsonError("Недостатньо прав", 403);
    }

    if (session.role !== "ADMIN" && status && status !== "CANCELLED") {
      return jsonError("Клієнт може лише скасувати запис", 403);
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        status: status ?? undefined,
        notes: notes ?? undefined,
        dateTime: dateTime ? new Date(dateTime) : undefined,
      },
      include: {
        client: { select: { id: true, name: true, email: true, phone: true } },
        doctor: true,
        service: true,
        pet: true,
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
    await requireAuth(["ADMIN"]);
    const { id } = await params;
    await prisma.appointment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    const authError = handleAuthError(error);
    if (authError) return authError;
    return jsonError("Помилка видалення", 500);
  }
}
