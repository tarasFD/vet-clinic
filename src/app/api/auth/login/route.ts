import { NextRequest, NextResponse } from "next/server";
import { authenticateUser, createToken, setSessionCookie } from "@/lib/auth";
import { jsonError } from "@/lib/api-utils";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return jsonError("Введіть email та пароль", 400);
    }

    const user = await authenticateUser(email, password);
    if (!user) {
      return jsonError("Невірний email або пароль", 401);
    }

    const token = await createToken(user);
    await setSessionCookie(token);

    return NextResponse.json(user);
  } catch {
    return jsonError("Помилка входу", 500);
  }
}
