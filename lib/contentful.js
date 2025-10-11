import { createClient } from "contentful";

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

export const getArticleBySlug = async (slug) => {
  const { items } = await client.getEntries({
    content_type: "blogPost",
    "fields.slug": slug,
    limit: 1,
  });

  console.log("Found items:", items.length);
  console.log("First item:", items[0]?.fields?.slug);

  return items[0] || null;
};

export const getAllArticles = async () => {
  const { items } = await client.getEntries({
    content_type: "blogPost",
    limit: 1000,
  });

  return items;
};
