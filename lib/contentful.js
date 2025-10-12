import { createClient } from "contentful";
import { createClient as createManagementClient } from "contentful-management";

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

// Management API - for writing (if token available)
let managementClient = null;
if (process.env.CONTENTFUL_MANAGEMENT_TOKEN) {
  managementClient = createManagementClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
  });
}

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

export const updateArticleWithSummary = async (articleId, summary) => {
  if (!managementClient) {
    console.log("Management client not available - skipping storage");
    return;
  }

  try {
    const space = await managementClient.getSpace(
      process.env.CONTENTFUL_SPACE_ID
    );
    const environment = await space.getEnvironment("master");
    const entry = await environment.getEntry(articleId);

    // Remove the old summary field to avoid validation errors
    if (entry.fields.summary) {
      delete entry.fields.summary;
    }

    // Update only the aiSummary field
    entry.fields.aiSummary = {
      "en-US": summary,
    };

    const updatedEntry = await entry.update();
    await updatedEntry.publish();

    console.log(`Successfully stored AI summary for article ${articleId}`);
    return updatedEntry;
  } catch (error) {
    console.error("Contentful storage error:", error);
    throw error;
  }
};
