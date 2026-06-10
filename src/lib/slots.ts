import { addMinutes, format, isBefore, parseISO, set } from "date-fns";
import { prisma } from "./prisma";

export async function getAvailableSlots(
  doctorId: string,
  serviceId: string,
  date: string,
): Promise<string[]> {
  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) return [];

  const targetDate = parseISO(date);
  const dayOfWeek = targetDate.getDay();

  const schedule = await prisma.doctorSchedule.findFirst({
    where: { doctorId, dayOfWeek },
  });
  if (!schedule) return [];

  const [startHour, startMinute] = schedule.startTime.split(":").map(Number);
  const [endHour, endMinute] = schedule.endTime.split(":").map(Number);

  const dayStart = set(targetDate, {
    hours: startHour,
    minutes: startMinute,
    seconds: 0,
    milliseconds: 0,
  });
  const dayEnd = set(targetDate, {
    hours: endHour,
    minutes: endMinute,
    seconds: 0,
    milliseconds: 0,
  });

  const dayStartUtc = new Date(dayStart);
  const dayEndUtc = new Date(dayEnd);

  const existingAppointments = await prisma.appointment.findMany({
    where: {
      doctorId,
      dateTime: {
        gte: dayStartUtc,
        lt: dayEndUtc,
      },
      status: { not: "CANCELLED" },
    },
    include: { service: true },
  });

  const slots: string[] = [];
  let current = dayStartUtc;
  const now = new Date();

  while (isBefore(addMinutes(current, service.duration), dayEndUtc)) {
    const slotEnd = addMinutes(current, service.duration);
    const hasConflict = existingAppointments.some((apt) => {
      const aptEnd = addMinutes(apt.dateTime, apt.service.duration);
      return current < aptEnd && slotEnd > apt.dateTime;
    });

    if (!hasConflict && !isBefore(current, now)) {
      slots.push(format(current, "HH:mm"));
    }

    current = addMinutes(current, 30);
  }

  return slots;
}
