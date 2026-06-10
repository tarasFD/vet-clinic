import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { DAY_NAMES } from "@/lib/constants";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default async function DoctorsPage() {
  const doctors = await prisma.doctor.findMany({
    include: { schedules: { orderBy: { dayOfWeek: "asc" } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Наші ветеринари
          </h1>
          <p className="text-xl text-blue-100">
            Досвідчені спеціалісти готові допомогти вашому улюбленцю
          </p>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:py-20">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-gray-600">
              Доступні{" "}
              <span className="font-bold text-blue-600">{doctors.length}</span>{" "}
              досвідчених ветеринарів
            </p>
          </div>
          <Link href="/booking">
            <Button>Записатися на прийом</Button>
          </Link>
        </div>

        <div className="grid gap-8">
          {doctors.map((doctor, idx) => (
            <Card key={doctor.id} hoverable className="overflow-hidden">
              <div className="flex flex-col gap-6 md:flex-row">
                {/* Doctor Avatar */}
                <div className="flex-shrink-0">
                  <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 text-6xl shadow-lg">
                    👨‍⚕️
                  </div>
                </div>

                {/* Doctor Info */}
                <div className="flex-1">
                  <div className="flex flex-col gap-2 mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {doctor.name}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="primary">{doctor.specialization}</Badge>
                      <Badge variant="success">Доступен</Badge>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {doctor.bio}
                  </p>

                  {doctor.schedules.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                        Графік роботи:
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {doctor.schedules.map((s) => (
                          <div
                            key={s.id}
                            className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 px-3 py-2 border border-blue-200"
                          >
                            <p className="text-xs font-semibold text-blue-900">
                              {DAY_NAMES[s.dayOfWeek]}
                            </p>
                            <p className="text-sm font-medium text-blue-700">
                              {s.startTime}–{s.endTime}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Link href="/booking">
                    <Button>Записатися до {doctor.name}</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-50 border-t border-gray-200 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Готові записатися?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
            Виберіть улюбленого ветеринара та запишіться на прийом у зручний для
            вас час
          </p>
          <Link href="/booking">
            <Button size="lg">Перейти до запису</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
