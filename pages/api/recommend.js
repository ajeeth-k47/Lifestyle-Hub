import { getAllArticles, getArticleBySlug } from "../../lib/contentful";
import { semanticSearch } from "../../lib/pinecone-client";

// Configuration
const MAX_RECOMMENDATIONS = 2;
const CONTENT_PREVIEW_LENGTH = 200;

// Build search query from article data
function buildSearchQuery(article) {
  const { title, content } = article.fields;
  const contentPreview = content.substring(0, CONTENT_PREVIEW_LENGTH);
  return `${title} ${contentPreview}`;
}

// Filter and limit recommendations
function processRecommendations(articles, currentSlug, limit) {
  return articles
    .filter((article) => article.slug !== currentSlug)
    .slice(0, limit);
}

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

    const searchQuery = buildSearchQuery(currentArticle);
    const similarArticles = await semanticSearch(
      searchQuery,
      MAX_RECOMMENDATIONS + 1
    );

    const recommendations = processRecommendations(
      similarArticles,
      articleSlug,
      MAX_RECOMMENDATIONS
    );

    res.json({
      success: true,
      data: {
        current_article: currentArticle.fields.title,
        recommendations,
      },
    });
  } catch (error) {
    console.error("Recommendations API error:", error);

    res.status(500).json({
      error: "Failed to generate recommendations",
    });
  }
}
