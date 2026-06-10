import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        {/* Footer Content Grid */}
        <div className="grid gap-8 md:grid-cols-4 mb-8">
          {/* Clinic Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🐾</span>
              <h3 className="text-lg font-bold text-gray-900">ВетКлініка</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Професійна ветеринарна допомога для ваших улюбленців з 2020 року.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-semibold text-gray-900">Навігація</h4>
            <div className="flex flex-col gap-3 text-sm">
              <Link
                href="/"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Головна
              </Link>
              <Link
                href="/about"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Про клініку
              </Link>
              <Link
                href="/services"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Послуги
              </Link>
              <Link
                href="/doctors"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Лікарі
              </Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4 font-semibold text-gray-900">Послуги</h4>
            <div className="flex flex-col gap-3 text-sm">
              <Link
                href="/services"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Консультація
              </Link>
              <Link
                href="/services"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Профілактика
              </Link>
              <Link
                href="/services"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Хірургія
              </Link>
              <Link
                href="/booking"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Запис на прийом
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-4 font-semibold text-gray-900">Контакти</h4>
            <div className="flex flex-col gap-3 text-sm">
              <div>
                <p className="text-gray-500">Адреса</p>
                <p className="text-gray-900 font-medium">
                  м. Київ, вул. Хрещатик, 15
                </p>
              </div>
              <div>
                <p className="text-gray-500">Телефон</p>
                <a
                  href="tel:+380441234567"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  +380 (44) 123-45-67
                </a>
              </div>
              <div>
                <p className="text-gray-500">Email</p>
                <a
                  href="mailto:info@vetclinic.ua"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  info@vetclinic.ua
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} ВетКлініка «Друзі». Всі права
              захищені.
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                href="#"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Конфіденційність
              </Link>
              <Link
                href="#"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Умови використання
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
