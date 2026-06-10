"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { DAY_NAMES } from "@/lib/constants";

interface Schedule {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  bio: string | null;
  schedules: Schedule[];
}

const emptyForm = {
  name: "",
  specialization: "",
  bio: "",
  schedules: [] as Schedule[],
};

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  function loadDoctors() {
    fetch("/api/doctors")
      .then((r) => r.json())
      .then(setDoctors);
  }

  useEffect(() => {
    loadDoctors();
  }, []);

  function startEdit(doctor: Doctor) {
    setEditingId(doctor.id);
    setForm({
      name: doctor.name,
      specialization: doctor.specialization,
      bio: doctor.bio ?? "",
      schedules: doctor.schedules.map((s) => ({
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
      })),
    });
    setShowForm(true);
  }

  function toggleSchedule(dayOfWeek: number) {
    const exists = form.schedules.find((s) => s.dayOfWeek === dayOfWeek);
    if (exists) {
      setForm({
        ...form,
        schedules: form.schedules.filter((s) => s.dayOfWeek !== dayOfWeek),
      });
    } else {
      setForm({
        ...form,
        schedules: [
          ...form.schedules,
          { dayOfWeek, startTime: "09:00", endTime: "17:00" },
        ],
      });
    }
  }

  function updateScheduleTime(
    dayOfWeek: number,
    field: "startTime" | "endTime",
    value: string,
  ) {
    setForm({
      ...form,
      schedules: form.schedules.map((s) =>
        s.dayOfWeek === dayOfWeek ? { ...s, [field]: value } : s,
      ),
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const url = editingId ? `/api/doctors/${editingId}` : "/api/doctors";
    const method = editingId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    loadDoctors();
  }

  async function handleDelete(id: string) {
    if (!confirm("Видалити цього лікаря?")) return;
    await fetch(`/api/doctors/${id}`, { method: "DELETE" });
    loadDoctors();
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Лікарі</h1>
        <Button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setForm(emptyForm);
          }}
        >
          + Додати лікаря
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Повне ім'я"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <Input
                label="Спеціалізація"
                value={form.specialization}
                onChange={(e) =>
                  setForm({ ...form, specialization: e.target.value })
                }
                required
              />
            </div>
            <Input
              label="Біографія"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />

            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">
                Графік роботи
              </p>
              <div className="space-y-2">
                {DAY_NAMES.map((day, index) => {
                  const schedule = form.schedules.find(
                    (s) => s.dayOfWeek === index,
                  );
                  return (
                    <div key={day} className="flex items-center gap-3">
                      <label className="flex w-28 items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={!!schedule}
                          onChange={() => toggleSchedule(index)}
                        />
                        {day}
                      </label>
                      {schedule && (
                        <>
                          <input
                            type="time"
                            value={schedule.startTime}
                            onChange={(e) =>
                              updateScheduleTime(
                                index,
                                "startTime",
                                e.target.value,
                              )
                            }
                            className="rounded border border-gray-300 px-2 py-1 text-sm"
                          />
                          <span className="text-gray-400">—</span>
                          <input
                            type="time"
                            value={schedule.endTime}
                            onChange={(e) =>
                              updateScheduleTime(
                                index,
                                "endTime",
                                e.target.value,
                              )
                            }
                            className="rounded border border-gray-300 px-2 py-1 text-sm"
                          />
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                {editingId ? "Зберегти" : "Створити"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
              >
                Скасувати
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {doctors.map((doctor) => (
          <Card key={doctor.id}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                <p className="text-sm text-emerald-600">
                  {doctor.specialization}
                </p>
                <p className="mt-1 text-sm text-gray-600">{doctor.bio}</p>
                {doctor.schedules.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {doctor.schedules.map((s) => (
                      <span
                        key={s.dayOfWeek}
                        className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                      >
                        {DAY_NAMES[s.dayOfWeek]}: {s.startTime}–{s.endTime}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => startEdit(doctor)}
                >
                  Редагувати
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(doctor.id)}
                >
                  Видалити
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
