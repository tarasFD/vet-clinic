import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { handleAuthError, jsonError } from "@/lib/api-utils";

export async function GET() {
  const doctors = await prisma.doctor.findMany({
    include: { schedules: { orderBy: { dayOfWeek: "asc" } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(doctors);
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth(["ADMIN"]);
    const { name, specialization, bio, schedules } = await request.json();

    if (!name || !specialization) {
      return jsonError("Заповніть обов'язкові поля", 400);
    }

    const doctor = await prisma.doctor.create({
      data: {
        name,
        specialization,
        bio,
        schedules: schedules?.length ? { create: schedules } : undefined,
      },
      include: { schedules: true },
    });

    return NextResponse.json(doctor, { status: 201 });
  } catch (error) {
    const authError = handleAuthError(error);
    if (authError) return authError;
    return jsonError("Помилка створення лікаря", 500);
  }
}
