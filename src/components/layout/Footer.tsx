import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-3 text-lg font-bold text-emerald-700">
              🐾 ВетКлініка
            </h3>
            <p className="text-sm text-gray-600">
              Професійна ветеринарна допомога для ваших улюбленців.
            </p>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-gray-900">Навігація</h4>
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <Link href="/about" className="hover:text-emerald-600">
                Про клініку
              </Link>
              <Link href="/services" className="hover:text-emerald-600">
                Послуги
              </Link>
              <Link href="/doctors" className="hover:text-emerald-600">
                Лікарі
              </Link>
              <Link href="/booking" className="hover:text-emerald-600">
                Запис на прийом
              </Link>
            </div>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-gray-900">Контакти</h4>
            <div className="flex flex-col gap-1 text-sm text-gray-600">
              <span>м. Київ, вул. Хрещатик, 15</span>
              <span>+380 (44) 123-45-67</span>
              <span>info@vetclinic.ua</span>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} ВетКлініка «Друзі». Дипломний проєкт.
        </div>
      </div>
    </footer>
  );
}
