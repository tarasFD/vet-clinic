import { BookingForm } from "@/components/booking/BookingForm";

export default function BookingPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Запис на прийом</h1>
      <BookingForm />
    </div>
  );
}
