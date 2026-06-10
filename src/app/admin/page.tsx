import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

export default async function AdminDashboard() {
  const [
    appointmentsCount,
    clientsCount,
    servicesCount,
    doctorsCount,
    pendingCount,
  ] = await Promise.all([
    prisma.appointment.count(),
    prisma.user.count({ where: { role: "CLIENT" } }),
    prisma.service.count({ where: { isActive: true } }),
    prisma.doctor.count(),
    prisma.appointment.count({ where: { status: "PENDING" } }),
  ]);

  const recentAppointments = await prisma.appointment.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      client: { select: { name: true } },
      doctor: { select: { name: true } },
      service: { select: { name: true } },
      pet: { select: { name: true } },
    },
  });

  const stats = [
    {
      label: "Усі записи",
      value: appointmentsCount,
      href: "/admin/appointments",
      color: "text-blue-600",
    },
    {
      label: "Очікують підтвердження",
      value: pendingCount,
      href: "/admin/appointments",
      color: "text-yellow-600",
    },
    {
      label: "Клієнти",
      value: clientsCount,
      href: "/admin/clients",
      color: "text-emerald-600",
    },
    {
      label: "Послуги",
      value: servicesCount,
      href: "/admin/services",
      color: "text-purple-600",
    },
    {
      label: "Лікарі",
      value: doctorsCount,
      href: "/admin/doctors",
      color: "text-orange-600",
    },
  ];

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Дашборд</h1>

      <div className="mb-8 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </Card>
          </Link>
        ))}
      </div>

      <Card title="Останні записи">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="pb-3 pr-4">Клієнт</th>
                <th className="pb-3 pr-4">Тварина</th>
                <th className="pb-3 pr-4">Послуга</th>
                <th className="pb-3 pr-4">Лікар</th>
                <th className="pb-3">Дата</th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.map((apt) => (
                <tr key={apt.id} className="border-b border-gray-100">
                  <td className="py-3 pr-4">{apt.client.name}</td>
                  <td className="py-3 pr-4">{apt.pet.name}</td>
                  <td className="py-3 pr-4">{apt.service.name}</td>
                  <td className="py-3 pr-4">{apt.doctor.name}</td>
                  <td className="py-3">
                    {new Date(apt.dateTime).toLocaleString("uk-UA")}
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
