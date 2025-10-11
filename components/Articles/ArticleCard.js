// components/Articles/ArticleCard.js
"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function ArticleCard({ article, priority = false }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const cardRef = useRef(null);
  const hasFetched = useRef(false);

  const articleUrl = `/article/${article.fields.slug}`;

  useEffect(() => {
    if (!priority && !hasFetched.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasFetched.current) {
            fetchSummary();
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      if (cardRef.current) {
        observer.observe(cardRef.current);
      }

      return () => observer.disconnect();
    } else if (priority && !hasFetched.current) {
      fetchSummary();
    }
  }, [priority]);

  async function fetchSummary() {
    if (hasFetched.current) return;

    hasFetched.current = true;
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
      console.error("Error fetching summary:", err);
      setError("Failed to load summary");
      setSummary(article.fields.content.substring(0, 150) + "...");
    } finally {
      setLoading(false);
    }
  }

  return (
    <article
      ref={cardRef}
      className="card h-100 shadow-sm hover-shadow"
      style={{ transition: "box-shadow 0.3s ease" }}
      aria-labelledby={`article-title-${article.sys.id}`}
    >
      <div className="card-body d-flex flex-column">
        {/* Title */}
        <h5
          id={`article-title-${article.sys.id}`}
          className="card-title text-dark"
        >
          {article.fields.title}
        </h5>

        {/* Summary Section */}
        <div className="card-text flex-grow-1 mb-3 p-2">
          {loading && (
            <div aria-live="polite">
              <div className="placeholder-glow">
                <span className="placeholder col-12 placeholder-lg"></span>
                <span className="placeholder col-10 placeholder-lg"></span>
                <span className="placeholder col-8 placeholder-lg"></span>
              </div>
            </div>
          )}

          {error && (
            <p className="text-danger small" role="alert">
              {error}
            </p>
          )}

          {summary && !loading && <p className="text-muted">{summary}</p>}

          {!summary && !loading && !error && (
            <p className="text-muted small">Summary will load shortly...</p>
          )}
        </div>

        {/* View Article Link */}
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
