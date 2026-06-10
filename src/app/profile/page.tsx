"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { uk } from "date-fns/locale";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
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
  doctor: { name: string; specialization: string };
  service: { name: string; price: number };
  pet: { name: string; species: string };
}

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  age: number | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [showAddPet, setShowAddPet] = useState(false);
  const [newPet, setNewPet] = useState({
    name: "",
    species: "DOG",
    breed: "",
    age: "",
  });

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => {
        if (!r.ok) {
          router.push("/login?redirect=/profile");
          return null;
        }
        return r.json();
      })
      .then((user) => {
        if (user) {
          fetch("/api/appointments")
            .then((r) => r.json())
            .then(setAppointments);
          fetch("/api/pets")
            .then((r) => r.json())
            .then(setPets);
        }
      });
  }, [router]);

  async function cancelAppointment(id: string) {
    await fetch(`/api/appointments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CANCELLED" }),
    });
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "CANCELLED" } : a)),
    );
  }

  async function handleAddPet() {
    const res = await fetch("/api/pets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPet),
    });
    if (res.ok) {
      const pet = await res.json();
      setPets((prev) => [...prev, pet]);
      setShowAddPet(false);
      setNewPet({ name: "", species: "DOG", breed: "", age: "" });
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Мій профіль</h1>

      <div className="grid gap-8">
        <Card title="Мої тварини">
          <div className="space-y-3">
            {pets.map((pet) => (
              <div
                key={pet.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 p-3"
              >
                <div>
                  <span className="font-medium">{pet.name}</span>
                  <span className="ml-2 text-sm text-gray-500">
                    {PET_SPECIES_LABELS[pet.species]}
                    {pet.breed && ` · ${pet.breed}`}
                    {pet.age && ` · ${pet.age} р.`}
                  </span>
                </div>
              </div>
            ))}
            {pets.length === 0 && (
              <p className="text-sm text-gray-500">
                У вас ще немає зареєстрованих тварин
              </p>
            )}
          </div>
          {showAddPet ? (
            <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
              <Input
                label="Кличка"
                value={newPet.name}
                onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
              />
              <Select
                label="Вид"
                value={newPet.species}
                onChange={(e) =>
                  setNewPet({ ...newPet, species: e.target.value })
                }
                options={Object.entries(PET_SPECIES_LABELS).map(
                  ([value, label]) => ({
                    value,
                    label,
                  }),
                )}
              />
              <Input
                label="Порода"
                value={newPet.breed}
                onChange={(e) =>
                  setNewPet({ ...newPet, breed: e.target.value })
                }
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddPet}>
                  Зберегти
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowAddPet(false)}
                >
                  Скасувати
                </Button>
              </div>
            </div>
          ) : (
            <Button
              size="sm"
              variant="secondary"
              className="mt-4"
              onClick={() => setShowAddPet(true)}
            >
              + Додати тварину
            </Button>
          )}
        </Card>

        <Card title="Мої записи на прийом">
          {appointments.length === 0 ? (
            <p className="text-sm text-gray-500">У вас немає записів</p>
          ) : (
            <div className="space-y-4">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="rounded-lg border border-gray-100 p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {format(new Date(apt.dateTime), "d MMMM yyyy, HH:mm", {
                          locale: uk,
                        })}
                      </p>
                      <p className="text-sm text-gray-600">
                        {apt.service.name} · {apt.doctor.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        🐾 {apt.pet.name} ({PET_SPECIES_LABELS[apt.pet.species]}
                        )
                      </p>
                    </div>
                    <Badge className={APPOINTMENT_STATUS_COLORS[apt.status]}>
                      {APPOINTMENT_STATUS_LABELS[apt.status]}
                    </Badge>
                  </div>
                  {apt.status === "PENDING" || apt.status === "CONFIRMED" ? (
                    <Button
                      size="sm"
                      variant="danger"
                      className="mt-3"
                      onClick={() => cancelAppointment(apt.id)}
                    >
                      Скасувати
                    </Button>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
