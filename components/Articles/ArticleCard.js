"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ArticleCard({ article }) {
  const [summary, setSummary] = useState(article.fields.aiSummary || null);
  const [loading, setLoading] = useState(!article.fields.aiSummary);
  const [error, setError] = useState(null);

  const articleUrl = `/article/${article.fields.slug}`;

  useEffect(() => {
    // Fetch summary immediately if not already available
    if (!article.fields.aiSummary) {
      fetchSummary();
    }
  }, []);

  async function fetchSummary() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          articleSlug: article.fields.slug,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate summary");
      }

      const data = await response.json();
      setSummary(data.data.summary);
    } catch (err) {
      setError("Failed to load summary");
      setSummary(article.fields.content.substring(0, 150) + "...");
    } finally {
      setLoading(false);
    }
  }

  return (
    <article
      className="card h-100 shadow-sm hover-shadow"
      style={{ transition: "box-shadow 0.3s ease" }}
      aria-labelledby={`article-title-${article.sys.id}`}
    >
      <div className="card-body d-flex flex-column">
        <h3
          id={`article-title-${article.sys.id}`}
          className="h5 card-title text-dark mb-3"
        >
          {article.fields.title}
        </h3>

        <div className="card-text flex-grow-1 mb-3">
          {loading && (
            <div aria-live="polite" aria-label="Loading article summary">
              <div className="placeholder-glow">
                <span
                  className="placeholder col-12 mb-2"
                  aria-hidden="true"
                ></span>
                <span
                  className="placeholder col-10 mb-2"
                  aria-hidden="true"
                ></span>
                <span className="placeholder col-8" aria-hidden="true"></span>
              </div>
              <span className="visually-hidden">Loading summary content</span>
            </div>
          )}

          {error && (
            <p className="text-danger small mb-0" role="alert">
              {error}
            </p>
          )}

          {summary && !loading && <p className="text-muted mb-0">{summary}</p>}
        </div>

        <div className="mt-auto">
          <Link
            href={articleUrl}
            className="btn btn-primary btn-sm"
            aria-label={`Read full article: ${article.fields.title}`}
          >
            View Article
          </Link>
        </div>
      </div>
    </article>
  );
}
