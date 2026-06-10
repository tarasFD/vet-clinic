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
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full -ml-40 -mb-40"></div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-24 md:py-32 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {clinic?.name ?? "ВетКлініка «Друзі»"}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              {clinic?.description ??
                "Професійна ветеринарна допомога для ваших улюбленців"}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/booking">
                <Button size="lg" className="text-blue-600 hover:bg-blue-50">
                  Записатися на прийом
                </Button>
              </Link>
              <Link href="/services">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-blue-700"
                >
                  Дізнатись більше
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 md:py-20 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: "📅",
                title: "Зручний запис",
                desc: "Запишіться на прийом онлайн 24/7 всього за кілька кліків",
              },
              {
                icon: "🏥",
                title: "Сучасне обладнання",
                desc: "Використовуємо найбільш передові методи діагностики",
              },
              {
                icon: "❤️",
                title: "Професійна допомога",
                desc: "Досвідчені ветеринари з індивідуальним підходом",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-700">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:py-20">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Наші послуги
          </h2>
          <p className="text-gray-600 text-lg">
            Повний спектр ветеринарної допомоги для вашого улюбленця
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Card key={service.id} hoverable className="flex flex-col">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2 text-lg">
                  {service.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                  {service.description}
                </p>
              </div>
              <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                <span className="font-semibold text-blue-600 text-lg">
                  {service.price} грн
                </span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {service.duration} хв
                </span>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/services">
            <Button size="lg" variant="outline">
              Усі послуги →
            </Button>
          </Link>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="bg-gray-50 border-y border-gray-200 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Наші лікарі
            </h2>
            <p className="text-gray-600 text-lg">
              Кваліфіковані спеціалісти з багаторічним досвідом роботи
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {doctors.map((doctor) => (
              <Card key={doctor.id} hoverable>
                <div className="mb-4 flex justify-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-5xl shadow-lg">
                    👨‍⚕️
                  </div>
                </div>
                <h3 className="text-center text-lg font-bold text-gray-900 mb-1">
                  {doctor.name}
                </h3>
                <p className="text-center text-sm font-semibold text-blue-600 mb-4">
                  {doctor.specialization}
                </p>
                <p className="text-center text-sm text-gray-600 line-clamp-3">
                  {doctor.bio}
                </p>
              </Card>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/doctors">
              <Button size="lg" variant="outline">
                Усі лікарі →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Потрібна допомога?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Запишіться на консультацію до нашого спеціаліста прямо зараз
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
