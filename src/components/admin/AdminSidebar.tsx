"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

const links = [
  { href: "/admin", label: "Дашборд", icon: "📊" },
  { href: "/admin/appointments", label: "Записи", icon: "📅" },
  { href: "/admin/clients", label: "Клієнти", icon: "👥" },
  { href: "/admin/services", label: "Послуги", icon: "🏥" },
  { href: "/admin/doctors", label: "Лікарі", icon: "👨‍⚕️" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="flex w-64 flex-col border-r border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-4">
        <Link href="/admin" className="text-lg font-bold text-emerald-700">
          🐾 Адмін-панель
        </Link>
      </div>
      <nav className="flex-1 p-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`mb-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              pathname === link.href
                ? "bg-emerald-50 text-emerald-700"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-gray-200 p-4 space-y-2">
        <Link
          href="/"
          className="block text-sm text-gray-500 hover:text-emerald-600"
        >
          ← На сайт
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full"
        >
          Вийти
        </Button>
      </div>
    </aside>
  );
}
