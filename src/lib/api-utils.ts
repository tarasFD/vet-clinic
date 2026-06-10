import { NextResponse } from "next/server";

export function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export function handleAuthError(error: unknown) {
  if (error instanceof Error) {
    if (error.message === "UNAUTHORIZED") {
      return jsonError("Необхідна авторизація", 401);
    }
    if (error.message === "FORBIDDEN") {
      return jsonError("Недостатньо прав доступу", 403);
    }
  }
  return null;
}
