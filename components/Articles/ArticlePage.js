"use client";
import { useState, useEffect } from "react";
import Header from "../Layout/Header";
import ArticleCard from "./ArticleCard";

export default function ArticlePage({ article }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecommendations() {
      try {
        const response = await fetch("/api/recommend", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            articleSlug: article.fields.slug,
          }),
        });

        const data = await response.json();
        setRecommendations(data.data?.recommendations || []);
      } catch (error) {
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    }

    loadRecommendations();
  }, [article.fields.slug]);

  return (
    <div className="min-vh-100 bg-light">
      <Header />

      <main className="container py-4">
        <div className="row">
          <div className="col-lg-8 mb-4">
            <article>
              <div className="card">
                <div className="card-body">
                  <h1 className="h2 mb-4">{article.fields.title}</h1>
                  <div
                    className="article-content"
                    style={{ lineHeight: "1.7", fontSize: "1.1rem" }}
                  >
                    {article.fields.content
                      .split("\n\n")
                      .map((paragraph, index) => (
                        <p key={index} className="text-muted mb-4">
                          {paragraph}
                        </p>
                      ))}
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div className="col-lg-4">
            <aside>
              <h2 className="h5 mb-3">Recommended Articles</h2>

              {loading ? (
                <div className="card">
                  <div className="card-body text-center">
                    <div
                      className="spinner-border spinner-border-sm text-primary"
                      aria-hidden="true"
                    ></div>
                    <p className="text-muted mt-2 mb-0">
                      Finding similar articles...
                    </p>
                  </div>
                </div>
              ) : recommendations.length > 0 ? (
                <div className="d-grid gap-3">
                  {recommendations.map((rec, index) => (
                    <ArticleCard
                      key={rec.contentful_id}
                      article={{
                        sys: { id: rec.contentful_id },
                        fields: {
                          title: rec.title,
                          slug: rec.slug,
                          content: rec.content_preview,
                        },
                      }}
                      priority={index < 2}
                    />
                  ))}
                </div>
              ) : (
                <div className="card">
                  <div className="card-body text-center">
                    <p className="text-muted mb-0">No similar articles found</p>
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
