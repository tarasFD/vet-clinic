import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { DAY_NAMES } from "@/lib/constants";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default async function DoctorsPage() {
  const doctors = await prisma.doctor.findMany({
    include: { schedules: { orderBy: { dayOfWeek: "asc" } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Наші лікарі</h1>
        <Link href="/booking">
          <Button>Записатися</Button>
        </Link>
      </div>

      <div className="grid gap-8">
        {doctors.map((doctor) => (
          <Card key={doctor.id}>
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-4xl">
                👨‍⚕️
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">
                  {doctor.name}
                </h3>
                <p className="text-emerald-600">{doctor.specialization}</p>
                <p className="mt-2 text-sm text-gray-600">{doctor.bio}</p>

                {doctor.schedules.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Графік роботи:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {doctor.schedules.map((s) => (
                        <span
                          key={s.id}
                          className="rounded-lg bg-gray-100 px-3 py-1 text-xs text-gray-700"
                        >
                          {DAY_NAMES[s.dayOfWeek]}: {s.startTime}–{s.endTime}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
