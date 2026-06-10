"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        password: formData.get("password"),
      }),
    });

    if (res.ok) {
      router.push("/profile");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Помилка реєстрації");
    }
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <Card title="Реєстрація">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <Input label="Повне ім'я" name="name" required />
          <Input label="Email" name="email" type="email" required />
          <Input label="Телефон" name="phone" type="tel" />
          <Input
            label="Пароль"
            name="password"
            type="password"
            required
            minLength={6}
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Реєстрація..." : "Зареєструватися"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Вже маєте акаунт?{" "}
          <Link href="/login" className="text-emerald-600 hover:underline">
            Увійти
          </Link>
        </p>
      </Card>
    </div>
  );
}
