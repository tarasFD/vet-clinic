import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Послуги</h1>
        <Link href="/booking">
          <Button>Записатися</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.id}>
            <h3 className="text-lg font-semibold text-gray-900">
              {service.name}
            </h3>
            <p className="mt-2 text-sm text-gray-600">{service.description}</p>
            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
              <span className="text-lg font-bold text-emerald-600">
                {service.price} грн
              </span>
              <span className="text-sm text-gray-500">
                ⏱ {service.duration} хв
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
