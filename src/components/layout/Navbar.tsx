"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

interface UserInfo {
  name: string;
  role: string;
}

const navLinks = [
  { href: "/", label: "Головна" },
  { href: "/about", label: "Про клініку" },
  { href: "/services", label: "Послуги" },
  { href: "/doctors", label: "Лікарі" },
  { href: "/booking", label: "Запис" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, [pathname]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  }

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-emerald-700"
        >
          <span className="text-2xl">🐾</span>
          ВетКлініка
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
                pathname === link.href ? "text-emerald-600" : "text-gray-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              {user.role === "ADMIN" && (
                <Link href="/admin">
                  <Button variant="secondary" size="sm">
                    Адмін-панель
                  </Button>
                </Link>
              )}
              <Link
                href="/profile"
                className="text-sm text-gray-600 hover:text-emerald-600"
              >
                {user.name}
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Вийти
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Увійти
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Реєстрація</Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-gray-600"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Меню"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-sm font-medium text-gray-600"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 flex flex-col gap-2 border-t border-gray-100 pt-3">
            {user ? (
              <>
                <Link href="/profile" className="text-sm text-gray-600">
                  Профіль
                </Link>
                {user.role === "ADMIN" && (
                  <Link href="/admin" className="text-sm text-gray-600">
                    Адмін-панель
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-left text-sm text-gray-600"
                >
                  Вийти
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-gray-600">
                  Увійти
                </Link>
                <Link href="/register" className="text-sm text-emerald-600">
                  Реєстрація
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
