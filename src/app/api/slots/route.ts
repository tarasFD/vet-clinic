import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/slots";
import { jsonError } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  const doctorId = request.nextUrl.searchParams.get("doctorId");
  const serviceId = request.nextUrl.searchParams.get("serviceId");
  const date = request.nextUrl.searchParams.get("date");

  if (!doctorId || !serviceId || !date) {
    return jsonError("Потрібні параметри: doctorId, serviceId, date", 400);
  }

  const slots = await getAvailableSlots(doctorId, serviceId, date);
  return NextResponse.json(slots);
}
