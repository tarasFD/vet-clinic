"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { PET_SPECIES_LABELS } from "@/lib/constants";

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}

interface Doctor {
  id: string;
  name: string;
  specialization: string;
}

interface Pet {
  id: string;
  name: string;
  species: string;
}

export function BookingForm() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showNewPet, setShowNewPet] = useState(false);

  const [form, setForm] = useState({
    serviceId: "",
    doctorId: "",
    petId: "",
    date: "",
    time: "",
    notes: "",
  });

  const [newPet, setNewPet] = useState({
    name: "",
    species: "DOG",
    breed: "",
    age: "",
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/services").then((r) => r.json()),
      fetch("/api/doctors").then((r) => r.json()),
      fetch("/api/auth/me").then((r) => (r.ok ? r.json() : null)),
    ]).then(([svc, doc, user]) => {
      setServices(svc);
      setDoctors(doc);
      if (user) {
        fetch("/api/pets")
          .then((r) => r.json())
          .then(setPets);
      }
    });
  }, []);

  useEffect(() => {
    if (form.doctorId && form.serviceId && form.date) {
      fetch(
        `/api/slots?doctorId=${form.doctorId}&serviceId=${form.serviceId}&date=${form.date}`,
      )
        .then((r) => r.json())
        .then(setSlots);
    } else {
      setSlots([]);
    }
  }, [form.doctorId, form.serviceId, form.date]);

  async function handleAddPet() {
    const res = await fetch("/api/pets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPet),
    });
    if (res.ok) {
      const pet = await res.json();
      setPets((prev) => [...prev, pet]);
      setForm((f) => ({ ...f, petId: pet.id }));
      setShowNewPet(false);
      setNewPet({ name: "", species: "DOG", breed: "", age: "" });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const meRes = await fetch("/api/auth/me");
    if (!meRes.ok) {
      router.push("/login?redirect=/booking");
      return;
    }

    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setSuccess(true);
      setForm({
        serviceId: "",
        doctorId: "",
        petId: "",
        date: "",
        time: "",
        notes: "",
      });
    } else {
      const data = await res.json();
      setError(data.error ?? "Помилка запису");
    }
    setLoading(false);
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  if (success) {
    return (
      <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-300">
        <div className="text-center py-8">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-emerald-900 mb-2">
            Запис створено успішно!
          </h2>
          <p className="text-emerald-800 mb-8">
            Ваш запис надіслано на розгляд. Адміністратор підтвердить його
            найближчим часом.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button onClick={() => setSuccess(false)}>Новий запис</Button>
            <Button variant="secondary" onClick={() => router.push("/profile")}>
              Мої записи
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="w-full">
      <Card
        title="📅 Онлайн-запис на прийом"
        className="border-2 border-blue-200"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-800 font-medium">
              ⚠️ {error}
            </div>
          )}

          {/* Service Selection */}
          <Select
            label="🏥 Оберіть послугу"
            value={form.serviceId}
            onChange={(e) =>
              setForm({ ...form, serviceId: e.target.value, time: "" })
            }
            options={[
              { value: "", label: "Оберіть послугу" },
              ...services.map((s) => ({
                value: s.id,
                label: `${s.name} (${s.duration} хв, ${s.price} грн)`,
              })),
            ]}
            required
          />

          {/* Doctor Selection */}
          <Select
            label="👨‍⚕️ Оберіть лікаря"
            value={form.doctorId}
            onChange={(e) =>
              setForm({ ...form, doctorId: e.target.value, time: "" })
            }
            options={[
              { value: "", label: "Оберіть лікаря" },
              ...doctors.map((d) => ({
                value: d.id,
                label: `${d.name} — ${d.specialization}`,
              })),
            ]}
            required
          />

          {/* Pet Selection */}
          <div>
            <Select
              label="🐾 Ваша тварина"
              value={form.petId}
              onChange={(e) => setForm({ ...form, petId: e.target.value })}
              options={[
                { value: "", label: "Оберіть тварину" },
                ...pets.map((p) => ({
                  value: p.id,
                  label: `${p.name} (${PET_SPECIES_LABELS[p.species]})`,
                })),
              ]}
              required
            />
            <button
              type="button"
              className="mt-3 inline-flex items-center px-3 py-2 rounded-lg bg-blue-50 text-blue-600 font-medium text-sm hover:bg-blue-100 transition-colors"
              onClick={() => setShowNewPet(!showNewPet)}
            >
              + Додати нову тварину
            </button>
          </div>

          {/* Add New Pet Form */}
          {showNewPet && (
            <div className="rounded-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6 space-y-4">
              <h4 className="font-bold text-blue-900">Нова тварина</h4>

              <Input
                label="Кличка"
                value={newPet.name}
                onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
                placeholder="Введіть кличку"
                required
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
                placeholder="Введіть породу"
              />

              <Input
                label="Вік (років)"
                type="number"
                value={newPet.age}
                onChange={(e) => setNewPet({ ...newPet, age: e.target.value })}
                placeholder="Введіть вік"
              />

              <Button type="button" size="md" onClick={handleAddPet}>
                Зберегти тварину
              </Button>
            </div>
          )}

          {/* Date Selection */}
          <Input
            label="📆 Оберіть дату"
            type="date"
            min={minDate}
            value={form.date}
            onChange={(e) =>
              setForm({ ...form, date: e.target.value, time: "" })
            }
            required
          />

          {/* Time Selection */}
          {slots.length > 0 ? (
            <Select
              label="🕐 Оберіть час"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              options={[
                { value: "", label: "Оберіть час" },
                ...slots.map((s) => ({ value: s, label: s })),
              ]}
              required
            />
          ) : form.date && form.doctorId && form.serviceId ? (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
              ℹ️ Немає вільних слотів на цю дату. Спробуйте іншу дату.
            </div>
          ) : null}

          {/* Notes */}
          <Input
            label="📝 Примітки (необов'язково)"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Додайте будь-які особливі примітки про вашу тварину..."
          />

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-lg"
          >
            {loading ? "⏳ Записуємо..." : "✅ Записатися на прийом"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
