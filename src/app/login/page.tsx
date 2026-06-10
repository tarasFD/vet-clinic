"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    if (res.ok) {
      const user = await res.json();
      router.push(user.role === "ADMIN" ? "/admin" : redirect);
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Помилка входу");
    }
    setLoading(false);
  }

  return (
    <Card title="Вхід до системи">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <Input label="Email" name="email" type="email" required />
        <Input label="Пароль" name="password" type="password" required />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Вхід..." : "Увійти"}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Немає акаунту?{" "}
        <Link href="/register" className="text-emerald-600 hover:underline">
          Зареєструватися
        </Link>
      </p>
      <div className="mt-4 rounded-lg bg-gray-50 p-3 text-xs text-gray-500">
        <p>Тестові акаунти:</p>
        <p>Адмін: admin@vetclinic.ua / admin123</p>
        <p>Клієнт: client@example.com / client123</p>
      </div>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
