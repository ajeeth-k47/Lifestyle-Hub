import { getAllArticles } from "../lib/contentful";
import Header from "../components/Layout/Header";
import ArticleGrid from "../components/Home/ArticleGrid";
import Pagination from "../components/Home/Pagination";

const ARTICLES_PER_PAGE = 6;

export default async function Home({ searchParams }) {
  const { page: pageParam } = await searchParams;
  const currentPage = Number(pageParam) || 1;

  try {
    const allArticles = await getAllArticles();
    const totalPages = Math.ceil(allArticles.length / ARTICLES_PER_PAGE);
    const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
    const currentArticles = allArticles.slice(
      startIndex,
      startIndex + ARTICLES_PER_PAGE
    );

    return (
      <div className="min-vh-100 bg-light">
        <Header />
        <main className="container py-4">
          <h1 className="h3 pb-4">Latest Articles</h1>

          <ArticleGrid articles={currentArticles} />

          {allArticles.length > ARTICLES_PER_PAGE && (
            <Pagination currentPage={currentPage} totalPages={totalPages} />
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
