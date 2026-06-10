import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";

export default async function AboutPage() {
  const clinic = await prisma.clinicInfo.findUnique({
    where: { id: "default" },
  });

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Про ВетКлініку
          </h1>
          <p className="text-xl text-blue-100">
            Ваш надійний партнер у догляді за здоров'ям ваших улюбленців
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:py-20">
        {/* Clinic Description */}
        <Card className="mb-12 border-l-4 border-l-blue-600 bg-gradient-to-br from-blue-50 to-white">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {clinic?.name ?? "ВетКлініка «Друзі»"}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            {clinic?.description}
          </p>
          <p className="text-gray-600">
            Ми надаємо комплексний спектр ветеринарних послуг для собак, котів
            та інших домашніх тварин. Наша команда складається з
            висококваліфікованих фахівців з багаторічним досвідом роботи.
          </p>
        </Card>

        {/* Two Column Layout */}
        <div className="grid gap-12 md:grid-cols-2 mb-12">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Контактна інформація
            </h3>
            <div className="space-y-4">
              <Card className="bg-gradient-to-br from-blue-50 to-white">
                <h4 className="font-semibold text-gray-900 mb-2">📍 Адреса</h4>
                <p className="text-gray-700">{clinic?.address}</p>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-50 to-white">
                <h4 className="font-semibold text-gray-900 mb-2">📞 Телефон</h4>
                <a
                  href={`tel:${clinic?.phone}`}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  {clinic?.phone}
                </a>
              </Card>

              <Card className="bg-gradient-to-br from-amber-50 to-white">
                <h4 className="font-semibold text-gray-900 mb-2">📧 Email</h4>
                <a
                  href={`mailto:${clinic?.email}`}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  {clinic?.email}
                </a>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-white">
                <h4 className="font-semibold text-gray-900 mb-2">
                  🕐 Графік роботи
                </h4>
                <p className="text-gray-700">{clinic?.workingHours}</p>
              </Card>
            </div>
          </div>

          {/* Our Advantages */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Чому вибирають нас?
            </h3>
            <div className="space-y-3">
              {[
                "✓ Досвідчені ветеринарні лікарі",
                "✓ Сучасне діагностичне обладнання",
                "✓ Онлайн-запис на прийом 24/7",
                "✓ Індивідуальний підхід до кожного пацієнта",
                "✓ Екстрена допомога та консультації",
                "✓ Зручне розташування в центрі міста",
                "✓ Дружелюбний та професійний персонал",
                "✓ Справедливі та прозорі ціни",
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200"
                >
                  <span className="text-lg mt-0.5">{item.charAt(0)}</span>
                  <p className="text-gray-800 font-medium">
                    {item.substring(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission and Values */}
        <div className="grid gap-6 md:grid-cols-3 mt-16">
          <Card className="text-center bg-gradient-to-br from-blue-50 to-white hover:shadow-lg">
            <div className="text-4xl mb-4">🎯</div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Наша місія</h4>
            <p className="text-gray-600">
              Забезпечувати найкращу ветеринарну допомогу для здоров'я та
              благополуччя ваших улюбленців
            </p>
          </Card>

          <Card className="text-center bg-gradient-to-br from-emerald-50 to-white hover:shadow-lg">
            <div className="text-4xl mb-4">💚</div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">
              Наші цінності
            </h4>
            <p className="text-gray-600">
              Turботливість, професіоналізм, честь та вірність у кожному
              взаємодії з клієнтами
            </p>
          </Card>

          <Card className="text-center bg-gradient-to-br from-amber-50 to-white hover:shadow-lg">
            <div className="text-4xl mb-4">🚀</div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">
              Наш розвиток
            </h4>
            <p className="text-gray-600">
              Постійне удосконалення знань та впровадження інноваційних методів
              лікування
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}
