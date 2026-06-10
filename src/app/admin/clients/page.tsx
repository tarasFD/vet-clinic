"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
  _count: { pets: number; appointments: number };
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    fetch("/api/clients")
      .then((r) => r.json())
      .then(setClients);
  }, []);

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Клієнти</h1>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="pb-3 pr-4">Ім&apos;я</th>
                <th className="pb-3 pr-4">Email</th>
                <th className="pb-3 pr-4">Телефон</th>
                <th className="pb-3 pr-4">Тварини</th>
                <th className="pb-3 pr-4">Записи</th>
                <th className="pb-3">Дата реєстрації</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-medium">{client.name}</td>
                  <td className="py-3 pr-4">{client.email}</td>
                  <td className="py-3 pr-4">{client.phone ?? "—"}</td>
                  <td className="py-3 pr-4">{client._count.pets}</td>
                  <td className="py-3 pr-4">{client._count.appointments}</td>
                  <td className="py-3">
                    {new Date(client.createdAt).toLocaleDateString("uk-UA")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
