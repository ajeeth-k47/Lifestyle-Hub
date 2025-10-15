import ArticleCard from "../Articles/ArticleCard";

export default function ArticleGrid({ articles }) {
  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">No articles found.</p>
      </div>
    );
  }

  return (
    <section aria-label="Articles grid" className="row g-4">
      {articles.map((article, index) => (
        <div key={article.sys.id} className="col-md-6 col-lg-4">
          <ArticleCard article={article} />
        </div>
      ))}
    </section>
  );
}
