"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { uk } from "date-fns/locale";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import {
  APPOINTMENT_STATUS_COLORS,
  APPOINTMENT_STATUS_LABELS,
  PET_SPECIES_LABELS,
} from "@/lib/constants";

interface Appointment {
  id: string;
  dateTime: string;
  status: string;
  notes: string | null;
  client: { name: string; email: string; phone: string | null };
  doctor: { name: string };
  service: { name: string; price: number };
  pet: { name: string; species: string };
}

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const url = filter
      ? `/api/appointments?status=${filter}`
      : "/api/appointments";
    fetch(url)
      .then((r) => r.json())
      .then(setAppointments);
  }, [filter]);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/appointments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a)),
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Керування записами</h1>
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          options={[
            { value: "", label: "Усі статуси" },
            ...Object.entries(APPOINTMENT_STATUS_LABELS).map(
              ([value, label]) => ({
                value,
                label,
              }),
            ),
          ]}
        />
      </div>

      <div className="space-y-4">
        {appointments.map((apt) => (
          <Card key={apt.id}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <p className="font-medium text-gray-900">
                    {format(new Date(apt.dateTime), "d MMMM yyyy, HH:mm", {
                      locale: uk,
                    })}
                  </p>
                  <Badge className={APPOINTMENT_STATUS_COLORS[apt.status]}>
                    {APPOINTMENT_STATUS_LABELS[apt.status]}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  {apt.client.name} · {apt.client.email}
                  {apt.client.phone && ` · ${apt.client.phone}`}
                </p>
                <p className="text-sm text-gray-600">
                  {apt.service.name} ({apt.service.price} грн) ·{" "}
                  {apt.doctor.name}
                </p>
                <p className="text-sm text-gray-500">
                  🐾 {apt.pet.name} ({PET_SPECIES_LABELS[apt.pet.species]})
                </p>
                {apt.notes && (
                  <p className="mt-1 text-sm text-gray-500">
                    Примітка: {apt.notes}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {apt.status === "PENDING" && (
                  <Button
                    size="sm"
                    onClick={() => updateStatus(apt.id, "CONFIRMED")}
                  >
                    Підтвердити
                  </Button>
                )}
                {(apt.status === "PENDING" || apt.status === "CONFIRMED") && (
                  <>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => updateStatus(apt.id, "COMPLETED")}
                    >
                      Завершити
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => updateStatus(apt.id, "CANCELLED")}
                    >
                      Скасувати
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        ))}
        {appointments.length === 0 && (
          <p className="text-center text-gray-500">Записів не знайдено</p>
        )}
      </div>
    </div>
  );
}
