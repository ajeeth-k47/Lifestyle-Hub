// lib/ai.js
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generateSummary = async (articleContent) => {
  const prompt = `Create a concise 3-4 line summary (max 300 characters) of the following article for a lifestyle blog. 
Write directly as the summary without introductory phrases like "here is the summary" or using quotes.

Article: "${articleContent}"

Summary:`;

  try {
    console.log("Calling Groq API...");

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.1-8b-instant", // Free and fast
      temperature: 0.3,
      max_tokens: 150,
      stream: false,
    });

    console.log("Groq response received");
    const summary = completion.choices[0].message.content.trim();

    return summary;
  } catch (error) {
    console.error("Groq API Error:", error);

    // Fallback summary if Groq fails
    return generateFallbackSummary(articleContent);
  }
};

// Fallback function (keeps your app working)
function generateFallbackSummary(content) {
  console.log("Using fallback summary");

  // Simple text extraction
  const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 10);
  const firstSentence = sentences[0]?.trim() || "";
  const secondSentence = sentences[1]?.trim() || "";

  let summary = firstSentence;
  if (secondSentence && summary.length < 100) {
    summary += " " + secondSentence;
  }

  // Ensure it ends properly
  if (summary && !summary.endsWith(".")) {
    summary += ".";
  }

  // Limit length
  if (summary.length > 200) {
    summary = summary.substring(0, 200) + "...";
  }

  return summary || "Summary not available.";
}
