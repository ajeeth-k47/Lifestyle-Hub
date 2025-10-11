import { getAllArticles, getArticleBySlug } from "../../lib/contentful";
import { semanticSearch } from "../../lib/pinecone-client";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { articleSlug } = req.body;

  if (!articleSlug) {
    return res.status(400).json({ error: "Article slug is required" });
  }

  try {
    const currentArticle = await getArticleBySlug(articleSlug);

    if (!currentArticle) {
      return res.status(404).json({ error: "Article not found" });
    }

    const allArticles = await getAllArticles();

    // Use the current article's content to find similar articles
    const searchQuery = `${
      currentArticle.fields.title
    } ${currentArticle.fields.content.substring(0, 200)}`;

    const similarArticles = await semanticSearch(searchQuery, 4);

    // Filter out the current article from recommendations
    const recommendations = similarArticles
      .filter((article) => article.slug !== articleSlug)
      .slice(0, 3);

    res.json({
      success: true,
      data: {
        current_article: currentArticle.fields.title,
        recommendations: recommendations,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || "Failed to generate recommendations",
    });
  }
}
