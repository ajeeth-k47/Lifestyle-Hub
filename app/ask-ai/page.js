// app/ask-ai/page.js
"use client";
import { useState } from "react";
import Header from "../../components/Layout/Header";

export default function AskAIPage() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch("/api/rag-ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: question.trim() }),
      });

      const data = await res.json();
      setResponse(data.data);
      setQuestion("");
    } catch (err) {
      setResponse({
        answer:
          "Sorry, I'm having trouble connecting right now. Please try again.",
        articlesUsed: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      <Header />

      <main className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Simple Lily Introduction */}
            <div className="card bg-primary text-white mb-4">
              <div className="card-body text-center">
                <div className="mb-3" style={{ fontSize: "3rem" }}>
                  👩‍💻
                </div>
                <h2 className="h4 mb-2">Hi, I'm Lily!</h2>
                <p className="mb-0">
                  Your AI assistant. Ask me anything about lifestyle topics.
                </p>
              </div>
            </div>

            {/* Simple Input Form */}
            <div className="card mb-4">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <input
                      type="text"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="What would you like to know?"
                      className="form-control"
                      disabled={loading}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !question.trim()}
                    className="btn btn-primary w-100"
                  >
                    {loading ? "Thinking..." : "Ask Lily"}
                  </button>
                </form>
              </div>
            </div>

            {/* Simple Response Display */}
            {loading && (
              <div className="card">
                <div className="card-body text-center">
                  <div className="spinner-border text-primary mb-2"></div>
                  <p className="text-muted mb-0">
                    Lily is searching for answers...
                  </p>
                </div>
              </div>
            )}

            {response && !loading && (
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Lily's Answer:</h5>
                  <p className="card-text">{response.answer}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
