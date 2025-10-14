import { getAllArticles } from "../../lib/contentful";
import { semanticSearch } from "../../lib/pinecone-client";
import { generateAIResponse } from "../../lib/ai";

// Build context from relevant articles
function buildContext(articles) {
  return articles
    .map((article) => `${article.fields.title}: ${article.fields.content}`)
    .join("\n\n");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { question } = req.body;
  const trimmedQuestion = question?.trim();

  if (!trimmedQuestion || trimmedQuestion.length < 3) {
    return res.status(400).json({
      error: "Question must be at least 3 characters",
    });
  }

  try {
    const relevantResults = await semanticSearch(trimmedQuestion);

    if (!relevantResults.length) {
      return res.json({
        success: true,
        data: {
          answer: "I couldn't find relevant information in our articles.",
          articlesUsed: 0,
        },
      });
    }

    const articles = await getAllArticles();

    const relevantArticles = relevantResults
      .map((result) =>
        articles.find((article) => article.sys.id === result.contentful_id)
      )
      .filter(Boolean);

    const context = buildContext(relevantArticles);
    const answer = await generateAIResponse(context, trimmedQuestion);

    res.json({
      success: true,
      data: {
        answer,
        articlesUsed: relevantArticles.length,
      },
    });
  } catch (error) {
    console.error("RAG Ask error:", error);

    res.status(500).json({
      error: "Unable to process your question at this time",
    });
  }
}
