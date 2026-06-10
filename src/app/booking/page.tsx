import { BookingForm } from "@/components/booking/BookingForm";

export default function BookingPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Запис на прийом
          </h1>
          <p className="text-xl text-blue-100">
            Виберіть зручний час для консультації вашого улюбленця
          </p>
        </div>
      </section>

      {/* Booking Form */}
      <section className="mx-auto max-w-2xl px-4 py-16 md:py-20">
        <BookingForm />
      </section>

      {/* Info Section */}
      <section className="bg-gray-50 border-t border-gray-200 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Як це працює?
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full text-white text-2xl font-bold mb-4 mx-auto">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Заповніть форму
              </h3>
              <p className="text-gray-600">
                Оберіть послугу, лікаря, дату та час, що вам підходять
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full text-white text-2xl font-bold mb-4 mx-auto">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Отримайте підтвердження
              </h3>
              <p className="text-gray-600">
                Ми надішлемо вам підтвердження на email або SMS
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full text-white text-2xl font-bold mb-4 mx-auto">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Відвідайте клініку
              </h3>
              <p className="text-gray-600">
                Приходьте на прийом у встановлений час з вашим улюбленцем
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
