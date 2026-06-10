import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { handleAuthError, jsonError } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const status = request.nextUrl.searchParams.get("status");

    const where =
      session.role === "ADMIN"
        ? { ...(status ? { status: status as "PENDING" } : {}) }
        : {
            clientId: session.id,
            ...(status ? { status: status as "PENDING" } : {}),
          };

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        client: { select: { id: true, name: true, email: true, phone: true } },
        doctor: { select: { id: true, name: true, specialization: true } },
        service: {
          select: { id: true, name: true, duration: true, price: true },
        },
        pet: { select: { id: true, name: true, species: true, breed: true } },
      },
      orderBy: { dateTime: "asc" },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    const authError = handleAuthError(error);
    if (authError) return authError;
    return jsonError("Помилка завантаження", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth(["CLIENT", "ADMIN"]);
    const { doctorId, serviceId, petId, date, time, notes } =
      await request.json();

    if (!doctorId || !serviceId || !petId || !date || !time) {
      return jsonError("Заповніть усі обов'язкові поля", 400);
    }

    const pet = await prisma.pet.findUnique({ where: { id: petId } });
    if (!pet) return jsonError("Тварину не знайдено", 404);
    if (session.role !== "ADMIN" && pet.ownerId !== session.id) {
      return jsonError("Недостатньо прав", 403);
    }

    const dateTime = new Date(`${date}T${time}:00`);

    const appointment = await prisma.appointment.create({
      data: {
        dateTime,
        notes,
        clientId: pet.ownerId,
        doctorId,
        serviceId,
        petId,
        status: "PENDING",
      },
      include: {
        doctor: true,
        service: true,
        pet: true,
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    const authError = handleAuthError(error);
    if (authError) return authError;
    return jsonError("Помилка створення запису", 500);
  }
}
