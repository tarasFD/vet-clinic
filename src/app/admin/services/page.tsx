"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

interface Service {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number;
  isActive: boolean;
}

const emptyForm = {
  name: "",
  description: "",
  duration: "30",
  price: "",
  isActive: true,
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  function loadServices() {
    fetch("/api/services?all=true")
      .then((r) => r.json())
      .then(setServices);
  }

  useEffect(() => {
    loadServices();
  }, []);

  function startEdit(service: Service) {
    setEditingId(service.id);
    setForm({
      name: service.name,
      description: service.description ?? "",
      duration: String(service.duration),
      price: String(service.price),
      isActive: service.isActive,
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const url = editingId ? `/api/services/${editingId}` : "/api/services";
    const method = editingId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    loadServices();
  }

  async function handleDelete(id: string) {
    if (!confirm("Деактивувати цю послугу?")) return;
    await fetch(`/api/services/${id}`, { method: "DELETE" });
    loadServices();
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Послуги</h1>
        <Button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setForm(emptyForm);
          }}
        >
          + Додати послугу
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <Input
              label="Назва"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              label="Ціна (грн)"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
            <Input
              label="Тривалість (хв)"
              type="number"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              required
            />
            <Input
              label="Опис"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <div className="flex gap-2 md:col-span-2">
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

      <div className="grid gap-4 md:grid-cols-2">
        {services.map((service) => (
          <Card key={service.id}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {service.name}
                  {!service.isActive && (
                    <span className="ml-2 text-xs text-red-500">
                      (неактивна)
                    </span>
                  )}
                </h3>
                <p className="text-sm text-gray-600">{service.description}</p>
                <p className="mt-2 text-sm">
                  <span className="font-medium text-emerald-600">
                    {service.price} грн
                  </span>
                  <span className="text-gray-500">
                    {" "}
                    · {service.duration} хв
                  </span>
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => startEdit(service)}
                >
                  Редагувати
                </Button>
                {service.isActive && (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(service.id)}
                  >
                    Видалити
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
