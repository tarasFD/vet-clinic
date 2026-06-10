import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Наші послуги</h1>
          <p className="text-xl text-blue-100">
            Повний спектр ветеринарної допомоги для вашого домашнього улюбленця
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:py-20">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-gray-600">
              Доступні{" "}
              <span className="font-bold text-blue-600">{services.length}</span>{" "}
              послуг
            </p>
          </div>
          <Link href="/booking">
            <Button>Записатися</Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id} hoverable>
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {service.name}
                </h3>
                <Badge variant="primary">{service.duration} хв</Badge>
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">
                {service.description}
              </p>

              <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-600">
                  {service.price} грн
                </span>
                <Link href="/booking">
                  <Button size="sm" variant="outline">
                    Записатися
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Готові пройти консультацію?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Запишіться на прийом до нашого спеціаліста прямо зараз
          </p>
          <Link href="/booking">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              Записатися на прийом
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
