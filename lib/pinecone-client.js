import { Pinecone } from "@pinecone-database/pinecone";

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const index = pinecone.Index("lifestyle-articles");

function generateContentHash(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString();
}

export async function syncArticlesToPinecone(articles) {
  const vectors = articles.map((article) => {
    const textForEmbedding = `${
      article.fields.title
    }. ${article.fields.content.substring(0, 1500)}`;
    const contentHash = generateContentHash(
      article.fields.content.substring(0, 500)
    );

    return {
      id: article.sys.id,
      values: new Array(1024).fill(0.001),
      metadata: {
        text: textForEmbedding,
        title: article.fields.title,
        slug: article.fields.slug,
        content_preview: article.fields.content.substring(0, 300),
        tags: article.fields.tags || [],
        contentful_id: article.sys.id,
        content_hash: contentHash,
        synced_at: new Date().toISOString(),
      },
    };
  });

  if (vectors.length > 0) {
    await index.upsert(vectors);
  }

  return vectors.length;
}

export async function semanticSearch(query, topK = 3) {
  const tempVector = {
    id: "temp-query",
    values: new Array(1024).fill(0.001),
    metadata: { text: query },
  };

  await index.upsert([tempVector]);

  const fetched = await index.fetch(["temp-query"]);
  const queryEmbedding = fetched.records["temp-query"].values;

  await index.deleteOne("temp-query");

  const results = await index.query({
    topK: topK,
    includeMetadata: true,
    vector: queryEmbedding,
  });

  return results.matches
    .filter((match) => match.score > 0.6)
    .map((match) => ({
      contentful_id: match.id,
      score: match.score,
      title: match.metadata.title,
      slug: match.metadata.slug,
      content_preview: match.metadata.content_preview,
      tags: match.metadata.tags,
    }));
}
