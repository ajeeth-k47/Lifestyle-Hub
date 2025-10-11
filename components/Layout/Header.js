// components/Layout/Header.js
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="bg-white shadow-sm border-bottom">
      <nav className="container">
        <div className="d-flex justify-content-between align-items-center py-3">
          {/* Brand */}
          <Link href="/" className="text-decoration-none">
            <h1 className="h3 mb-0 text-primary fw-bold">🏠 Lifestyle Hub</h1>
          </Link>

          {/* Navigation */}
          <div className="d-flex gap-4">
            <Link
              href="/"
              className={`text-decoration-none fw-medium pb-1 ${
                pathname === "/"
                  ? "text-primary border-bottom border-2 border-primary"
                  : "text-secondary"
              }`}
            >
              Home
            </Link>
            <Link
              href="/ask-ai"
              className={`text-decoration-none fw-medium pb-1 ${
                pathname === "/ask-ai"
                  ? "text-primary border-bottom border-2 border-primary"
                  : "text-secondary"
              }`}
            >
              Ask AI
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
