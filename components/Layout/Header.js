"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const isHomeActive = pathname === "/";
  const isAskAIActive = pathname === "/ask-ai";
  const isArticlePage = pathname.startsWith("/article/");

  const getLinkClass = (isActive) =>
    `text-decoration-none fw-medium pb-1 ${
      isActive
        ? "text-primary border-bottom border-2 border-primary"
        : "text-secondary"
    }`;

  return (
    <header className="bg-white shadow-sm border-bottom">
      <nav aria-label="Main navigation">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center py-3">
            <Link href="/" className="text-decoration-none">
              <h1 className="h3 mb-0 text-primary fw-bold">🏠 Lifestyle Hub</h1>
            </Link>

            <div className="d-flex gap-4">
              <Link
                href="/"
                className={getLinkClass(isHomeActive)}
                aria-current={isHomeActive ? "page" : undefined}
              >
                Home
              </Link>
              {isArticlePage && (
                <span className={getLinkClass(true)}>Article</span>
              )}
              <Link
                href="/ask-ai"
                className={getLinkClass(isAskAIActive)}
                aria-current={isAskAIActive ? "page" : undefined}
              >
                Ask AI
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
