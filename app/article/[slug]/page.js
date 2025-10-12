import { notFound } from "next/navigation";
import { getArticleBySlug, getAllArticles } from "../../../lib/contentful";
import ArticlePage from "../../../components/Articles/ArticlePage";

export async function generateStaticParams() {
  const articles = await getAllArticles();

  return articles.map((article) => ({
    slug: article.fields.slug,
  }));
}

export default async function ArticlePageRoute({ params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return <ArticlePage article={article} />;
}
