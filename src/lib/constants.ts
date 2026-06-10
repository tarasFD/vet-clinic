export const DAY_NAMES = [
  "Неділя",
  "Понеділок",
  "Вівторок",
  "Середа",
  "Четвер",
  "П'ятниця",
  "Субота",
];

export const PET_SPECIES_LABELS: Record<string, string> = {
  DOG: "Собака",
  CAT: "Кіт",
  BIRD: "Птах",
  RABBIT: "Кролик",
  OTHER: "Інше",
};

export const APPOINTMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: "Очікує",
  CONFIRMED: "Підтверджено",
  COMPLETED: "Завершено",
  CANCELLED: "Скасовано",
};

export const APPOINTMENT_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};
