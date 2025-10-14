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

    return summary;
  } catch (error) {
    return articleContent.substring(0, 200).trim() + "...";
  }
};

export const generateAIResponse = async (context, question) => {
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
};
