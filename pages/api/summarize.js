import {
  getArticleBySlug,
  updateArticleWithSummary,
} from "../../lib/contentful";
import { generateSummary } from "../../lib/ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { articleSlug } = req.body;

  if (!articleSlug) {
    return res.status(400).json({ error: "Article slug is required" });
  }

  try {
    const article = await getArticleBySlug(articleSlug);

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    const existingSummary = article.fields.aiSummary;

    if (existingSummary) {
      return res.json({
        success: true,
        data: {
          summary: existingSummary,
          source: "contentful",
          title: article.fields.title,
        },
      });
    }

    const aiSummary = await generateSummary(article.fields.content);

    try {
      await updateArticleWithSummary(article.sys.id, aiSummary);
    } catch (updateError) {
      console.error("Failed to store summary in Contentful:", updateError);
    }

    res.json({
      success: true,
      data: {
        summary: aiSummary,
        source: "ai_generated",
        title: article.fields.title,
      },
    });
  } catch (error) {
    console.error("Summarize API error:", error);

    res.status(500).json({
      error: "Failed to generate summary",
    });
  }
}
