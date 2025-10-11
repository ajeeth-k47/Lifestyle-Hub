import { getAllArticles } from "../../lib/contentful";
import { syncArticlesToPinecone } from "../../lib/pinecone-client";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const articles = await getAllArticles();

    if (articles.length === 0) {
      return res.status(400).json({ error: "No articles found" });
    }

    const syncedCount = await syncArticlesToPinecone(articles);

    res.json({
      success: true,
      message: `Synced ${syncedCount} articles to Pinecone`,
      articles_processed: syncedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
