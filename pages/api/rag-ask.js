import { getAllArticles } from "../../lib/contentful";
import { semanticSearch } from "../../lib/pinecone-client";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Retry function for reliable API calls
async function withRetry(operation, maxRetries = 2, delay = 1000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay * attempt));
    }
  }
}

// Build context from relevant articles
function buildContext(articles) {
  return articles
    .map((article) => `${article.fields.title}: ${article.fields.content}`)
    .join("\n\n");
}

// Generate AI response with Groq
async function generateAIResponse(context, question) {
  const prompt = `Based on this context, answer in 3-5 concise lines:

${context}

Question: ${question}

Concise Answer:`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.1-8b-instant",
    temperature: 0.3,
    max_tokens: 150,
  });

  return completion.choices[0].message.content.trim();
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
    // Retry semantic search for cold start issues
    const relevantResults = await withRetry(() =>
      semanticSearch(trimmedQuestion)
    );

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

    // Retry AI generation for cold start issues
    const answer = await withRetry(() =>
      generateAIResponse(context, trimmedQuestion)
    );

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
