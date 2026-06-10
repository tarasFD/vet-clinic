import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default async function HomePage() {
  const [clinic, services, doctors] = await Promise.all([
    prisma.clinicInfo.findUnique({ where: { id: "default" } }),
    prisma.service.findMany({ where: { isActive: true }, take: 4 }),
    prisma.doctor.findMany({ take: 3 }),
  ]);

  return (
    <div>
      <section className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h1 className="text-4xl font-bold md:text-5xl">
            {clinic?.name ?? "ВетКлініка «Друзі»"}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-emerald-100">
            {clinic?.description ??
              "Професійна ветеринарна допомога для ваших улюбленців"}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/booking">
              <Button
                size="lg"
                className="bg-white text-emerald-700 hover:bg-emerald-50"
              >
                Записатися на прийом
              </Button>
            </Link>
            <Link href="/services">
              <Button
                size="lg"
                variant="ghost"
                className="text-white hover:bg-emerald-700"
              >
                Наші послуги
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-8 text-2xl font-bold text-gray-900">Наші послуги</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Card key={service.id}>
              <h3 className="font-semibold text-gray-900">{service.name}</h3>
              <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                {service.description}
              </p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="font-medium text-emerald-600">
                  {service.price} грн
                </span>
                <span className="text-gray-500">{service.duration} хв</span>
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link href="/services" className="text-emerald-600 hover:underline">
            Усі послуги →
          </Link>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-8 text-2xl font-bold text-gray-900">Наші лікарі</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {doctors.map((doctor) => (
              <Card key={doctor.id}>
                <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl">
                  👨‍⚕️
                </div>
                <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                <p className="text-sm text-emerald-600">
                  {doctor.specialization}
                </p>
                <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                  {doctor.bio}
                </p>
              </Card>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/doctors" className="text-emerald-600 hover:underline">
              Усі лікарі →
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              icon: "📅",
              title: "Онлайн-запис",
              desc: "Запишіться на прийом у зручний для вас час",
            },
            {
              icon: "🏥",
              title: "Сучасне обладнання",
              desc: "Діагностика та лікування на найвищому рівні",
            },
            {
              icon: "❤️",
              title: "Турбота",
              desc: "Індивідуальний підхід до кожної тварини",
            },
          ].map((item) => (
            <div key={item.title} className="text-center">
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-semibold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
