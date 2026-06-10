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
    const { name, specialization, bio, schedules } = await request.json();

    if (schedules) {
      await prisma.doctorSchedule.deleteMany({ where: { doctorId: id } });
    }

    const doctor = await prisma.doctor.update({
      where: { id },
      data: {
        name,
        specialization,
        bio,
        schedules: schedules?.length ? { create: schedules } : undefined,
      },
      include: { schedules: true },
    });

    return NextResponse.json(doctor);
  } catch (error) {
    const authError = handleAuthError(error);
    if (authError) return authError;
    return jsonError("Помилка оновлення лікаря", 500);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth(["ADMIN"]);
    const { id } = await params;
    await prisma.doctor.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    const authError = handleAuthError(error);
    if (authError) return authError;
    return jsonError("Помилка видалення лікаря", 500);
  }
}
