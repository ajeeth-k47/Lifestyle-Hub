import { getAllArticles } from "../../lib/contentful";
import { semanticSearch } from "../../lib/pinecone-client";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { question } = req.body;

  if (!question || question.trim().length < 3) {
    return res
      .status(400)
      .json({ error: "Question must be at least 3 characters" });
  }

  try {
    const relevantResults = await semanticSearch(question);

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

    const context = relevantArticles
      .map((article) => `${article.fields.title}: ${article.fields.content}`)
      .join("\n\n");

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

    const answer = completion.choices[0].message.content.trim();

    res.json({
      success: true,
      data: {
        answer: answer,
        articlesUsed: relevantArticles.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || "Failed to generate answer",
    });
  }
}
