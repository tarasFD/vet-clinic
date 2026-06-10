import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.appointment.deleteMany();
  await prisma.pet.deleteMany();
  await prisma.doctorSchedule.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();
  await prisma.clinicInfo.deleteMany();

  const adminPassword = await bcrypt.hash("admin123", 10);
  const clientPassword = await bcrypt.hash("client123", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@vetclinic.ua",
      password: adminPassword,
      name: "Олена Коваленко",
      phone: "+380501234567",
      role: "ADMIN",
    },
  });

  const client = await prisma.user.create({
    data: {
      email: "client@example.com",
      password: clientPassword,
      name: "Іван Петренко",
      phone: "+380671112233",
      role: "CLIENT",
    },
  });

  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: "Первинний огляд",
        description: "Комплексний огляд тварини, консультація з догляду",
        duration: 30,
        price: 350,
      },
    }),
    prisma.service.create({
      data: {
        name: "Вакцинація",
        description: "Вакцинація від основних інфекційних захворювань",
        duration: 20,
        price: 450,
      },
    }),
    prisma.service.create({
      data: {
        name: "Хірургічна операція",
        description: "Планові та екстрені хірургічні втручання",
        duration: 90,
        price: 2500,
      },
    }),
    prisma.service.create({
      data: {
        name: "УЗД діагностика",
        description: "Ультразвукове дослідження внутрішніх органів",
        duration: 45,
        price: 800,
      },
    }),
    prisma.service.create({
      data: {
        name: "Стоматологія",
        description: "Чистка зубів, видалення зубного каменю",
        duration: 40,
        price: 600,
      },
    }),
  ]);

  const doctors = await Promise.all([
    prisma.doctor.create({
      data: {
        name: "Др. Марія Шевченко",
        specialization: "Терапевт",
        bio: "15 років досвіду у ветеринарній медицині. Спеціалізація — діагностика та лікування дрібних домашніх тварин.",
        schedules: {
          create: [
            { dayOfWeek: 1, startTime: "09:00", endTime: "17:00" },
            { dayOfWeek: 2, startTime: "09:00", endTime: "17:00" },
            { dayOfWeek: 3, startTime: "09:00", endTime: "17:00" },
            { dayOfWeek: 4, startTime: "09:00", endTime: "17:00" },
            { dayOfWeek: 5, startTime: "09:00", endTime: "15:00" },
          ],
        },
      },
    }),
    prisma.doctor.create({
      data: {
        name: "Др. Андрій Мельник",
        specialization: "Хірург",
        bio: "Спеціаліст з хірургічних операцій та травматології. Працює з собаками та котами.",
        schedules: {
          create: [
            { dayOfWeek: 2, startTime: "10:00", endTime: "18:00" },
            { dayOfWeek: 3, startTime: "10:00", endTime: "18:00" },
            { dayOfWeek: 4, startTime: "10:00", endTime: "18:00" },
            { dayOfWeek: 5, startTime: "10:00", endTime: "16:00" },
            { dayOfWeek: 6, startTime: "10:00", endTime: "14:00" },
          ],
        },
      },
    }),
    prisma.doctor.create({
      data: {
        name: "Др. Оксана Бондар",
        specialization: "Дерматолог",
        bio: "Експерт з лікування шкірних захворювань та алергій у тварин.",
        schedules: {
          create: [
            { dayOfWeek: 1, startTime: "10:00", endTime: "18:00" },
            { dayOfWeek: 3, startTime: "10:00", endTime: "18:00" },
            { dayOfWeek: 5, startTime: "09:00", endTime: "17:00" },
          ],
        },
      },
    }),
  ]);

  const pet = await prisma.pet.create({
    data: {
      name: "Барсик",
      species: "CAT",
      breed: "Британський короткошерстий",
      age: 3,
      ownerId: client.id,
    },
  });

  await prisma.appointment.create({
    data: {
      dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      status: "CONFIRMED",
      notes: "Плановий огляд",
      clientId: client.id,
      doctorId: doctors[0].id,
      serviceId: services[0].id,
      petId: pet.id,
    },
  });

  await prisma.clinicInfo.create({
    data: {
      id: "default",
      name: "ВетКлініка «Друзі»",
      description:
        "Сучасна ветеринарна клініка з повним спектром послуг для ваших улюбленців. Ми працюємо з 2010 року та надаємо якісну ветеринарну допомогу 24/7 для екстрених випадків.",
      address: "м. Київ, вул. Хрещатик, 15",
      phone: "+380441234567",
      email: "info@vetclinic.ua",
      workingHours: "Пн-Пт: 09:00–18:00, Сб: 10:00–14:00, Нд: вихідний",
    },
  });

  console.log("Seed completed!");
  console.log(`Admin: ${admin.email} / admin123`);
  console.log(`Client: ${client.email} / client123`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
