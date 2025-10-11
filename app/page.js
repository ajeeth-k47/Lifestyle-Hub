// app/page.js
import { getAllArticles } from "../lib/contentful";
import Header from "../components/Layout/Header";
import ArticleGrid from "../components/Home/ArticleGrid";
import Pagination from "../components/Home/Pagination";

const ARTICLES_PER_PAGE = 6;

export default async function Home({ searchParams }) {
  const page = Number(searchParams?.page) || 1;

  try {
    const allArticles = await getAllArticles();
    const totalPages = Math.ceil(allArticles.length / ARTICLES_PER_PAGE);
    const startIndex = (page - 1) * ARTICLES_PER_PAGE;
    const currentArticles = allArticles.slice(
      startIndex,
      startIndex + ARTICLES_PER_PAGE
    );

    return (
      <div className="min-vh-100 bg-light">
        <Header />
        <main className="container py-4">
          <h3 className="pb-4">Lifestyle Hub - Latest Articles</h3>

          <ArticleGrid articles={currentArticles} />

          {allArticles.length > ARTICLES_PER_PAGE && (
            <Pagination currentPage={page} totalPages={totalPages} />
          )}
        </main>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-vh-100 bg-light">
        <Header />
        <main className="container py-4">
          <div className="text-center py-5">
            <h1 className="h2 text-dark mb-3">Welcome to Lifestyle Hub</h1>
            <p className="text-muted">
              Articles will load here once available.
            </p>
          </div>
        </main>
      </div>
    );
  }
}
