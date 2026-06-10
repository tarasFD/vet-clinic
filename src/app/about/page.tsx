import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";

export default async function AboutPage() {
  const clinic = await prisma.clinicInfo.findUnique({
    where: { id: "default" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Про клініку</h1>

      <Card className="mb-8">
        <h2 className="text-xl font-semibold text-emerald-700 mb-4">
          {clinic?.name ?? "ВетКлініка «Друзі»"}
        </h2>
        <p className="text-gray-600 leading-relaxed">{clinic?.description}</p>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card title="Контактна інформація">
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="font-medium text-gray-500">Адреса</dt>
              <dd className="text-gray-900">{clinic?.address}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Телефон</dt>
              <dd className="text-gray-900">{clinic?.phone}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Email</dt>
              <dd className="text-gray-900">{clinic?.email}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Графік роботи</dt>
              <dd className="text-gray-900">{clinic?.workingHours}</dd>
            </div>
          </dl>
        </Card>

        <Card title="Наші переваги">
          <ul className="space-y-2 text-sm text-gray-600">
            <li>✓ Досвідчені ветеринарні лікарі</li>
            <li>✓ Сучасне діагностичне обладнання</li>
            <li>✓ Онлайн-запис на прийом 24/7</li>
            <li>✓ Індивідуальний підхід до кожного пацієнта</li>
            <li>✓ Екстрена допомога</li>
            <li>✓ Зручне розташування в центрі міста</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
