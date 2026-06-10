import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createToken, hashPassword, setSessionCookie } from "@/lib/auth";
import { jsonError } from "@/lib/api-utils";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, phone } = await request.json();

    if (!email || !password || !name) {
      return jsonError("Заповніть обов'язкові поля", 400);
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return jsonError("Користувач з таким email вже існує", 409);
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name, phone, role: "CLIENT" },
    });

    const sessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const token = await createToken(sessionUser);
    await setSessionCookie(token);

    return NextResponse.json(sessionUser, { status: 201 });
  } catch {
    return jsonError("Помилка реєстрації", 500);
  }
}
