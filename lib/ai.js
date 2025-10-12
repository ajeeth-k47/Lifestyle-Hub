import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generateSummary = async (articleContent) => {
  const prompt = `Create a concise 3-4 line summary (max 300 characters) of the following article for a lifestyle blog. 
Write directly as the summary without introductory phrases like "here is the summary" or using quotes.

Article: "${articleContent.substring(0, 2000)}"

Summary:`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.3,
      max_tokens: 150,
      stream: false,
    });

    let summary = completion.choices[0].message.content.trim();

    // Clean up response
    summary = summary
      .replace(/^["']|["']$/g, "")
      .replace(/^here (is|are) (the|a) summary:?\s*/i, "")
      .trim();

    // Limit to 300 characters
    if (summary.length > 300) {
      summary = summary.substring(0, 300).trim() + "...";
    }

    return summary;
  } catch (error) {
    return generateFallbackSummary(articleContent);
  }
};

function generateFallbackSummary(content) {
  const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 20);

  let summary = "";
  let charCount = 0;

  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (charCount + trimmed.length <= 280) {
      summary += (summary ? " " : "") + trimmed;
      charCount += trimmed.length + 1;
    } else {
      break;
    }
  }

  if (summary && !summary.endsWith(".")) {
    summary += ".";
  }

  if (charCount > 0 && summary.length < content.length) {
    summary += "...";
  }

  return summary || "Explore this article to learn more about this topic.";
}
