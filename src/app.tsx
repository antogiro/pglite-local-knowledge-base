import React, { useState, useEffect } from "react";
import { initSchema } from "./schema";
import { generateEmbedding } from "./embeddings";
import { insertDocument, searchDocuments, SearchResult } from "./search";

export function App() {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Database & ML-Modell werden geladen...");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    initSchema()
      .then(() => {
        setReady(true);
        setStatus("Bereit (OPFS + PGlite + pgvector)");
      })
      .catch((err) => {
        console.error(err);
        setStatus("Fehler bei der Initialisierung");
      });
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setLoading(true);
    setStatus("Generiere Embedding & speichere in PGlite...");

    try {
      const embedding = await generateEmbedding(content);
      await insertDocument({ title, content, embedding });
      setTitle("");
      setContent("");
      setStatus("Dokument erfolgreich in PGlite gespeichert!");
    } catch (err) {
      console.error(err);
      setStatus("Fehler beim Speichern");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setStatus("Berechne Abfrage-Embedding & suche in WASM-Postgres...");

    try {
      const qEmbedding = await generateEmbedding(query);
      const res = await searchDocuments(qEmbedding);
      setResults(res);
      setStatus(`Suche abgeschlossen. ${res.length} relevante Treffer gefunden.`);
    } catch (err) {
      console.error(err);
      setStatus("Fehler bei der Suche");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.badge}>Postgres in WebAssembly</div>
        <h1 style={styles.title}>PGlite Local Knowledge Base</h1>
        <p style={styles.subtitle}>
          100% Client-Side RAG & Semantische Suche mit <code>pgvector</code> & OPFS
        </p>
        <div style={styles.statusBox}>
          <span style={loading ? styles.dotPulse : styles.dotActive} />
          <strong>Status:</strong> {status}
        </div>
      </header>

      {!ready ? (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p>Initialisiere PostgreSQL WASM & lade Embedding-Modell...</p>
        </div>
      ) : (
        <main style={styles.grid}>
          {/* Eingabe-Formular */}
          <section style={styles.card}>
            <h2 style={styles.cardTitle}>Neues Dokument hinzufügen</h2>
            <form onSubmit={handleAdd} style={styles.form}>
              <div>
                <label style={styles.label}>Titel</label>
                <input
                  type="text"
                  placeholder="z.B. Espresso Zubereitung"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={styles.input}
                  disabled={loading}
                />
              </div>
              <div>
                <label style={styles.label}>Inhalt / Textabschnitt</label>
                <textarea
                  placeholder="Füge hier den Dokumententext ein..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  style={styles.textarea}
                  disabled={loading}
                />
              </div>
              <button type="submit" style={styles.buttonPrimary} disabled={loading || !title || !content}>
                {loading ? "Verarbeite..." : "In PGlite Speichern"}
              </button>
            </form>
          </section>

          {/* Such-Formular & Ergebnisse */}
          <section style={styles.card}>
            <h2 style={styles.cardTitle}>Semantische Vektorsuche</h2>
            <form onSubmit={handleSearch} style={styles.searchForm}>
              <input
                type="text"
                placeholder="Wonach suchst du? (z.B. Barista oder Kaffee)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={styles.input}
                disabled={loading}
              />
              <button type="submit" style={styles.buttonSecondary} disabled={loading || !query}>
                Suchen
              </button>
            </form>

            <div style={styles.resultsContainer}>
              {results.length === 0 && !loading && (
                <p style={styles.emptyText}>Noch keine Suchergebnisse. Starte eine Suche oben.</p>
              )}

              {results.map((item) => {
                const scorePercent = Math.min(Math.max(item.similarity * 100, 0), 100).toFixed(1);
                return (
                  <div key={item.id} style={styles.resultCard}>
                    <div style={styles.resultHeader}>
                      <h3 style={styles.resultTitle}>{item.title}</h3>
                      <span style={styles.scoreBadge}>{scorePercent}% Ähnlichkeit</span>
                    </div>
                    {/* Visualisierung des Cosinus-Score als Ladebalken */}
                    <div style={styles.progressBarBackground}>
                      <div style={{ ...styles.progressBarFill, width: `${scorePercent}%` }} />
                    </div>
                    <p style={styles.resultContent}>{item.content}</p>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      )}
    </div>
  );
}

// Inline Styles für sauberes, modernes UI-Design
const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#0f172a",
    color: "#f8fafc",
    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
    padding: "2rem 1rem",
  },
  header: {
    maxWidth: "1000px",
    margin: "0 auto 2.5rem auto",
    textAlign: "center",
  },
  badge: {
    display: "inline-block",
    padding: "0.25rem 0.75rem",
    borderRadius: "9999px",
    backgroundColor: "#1e293b",
    color: "#38bdf8",
    fontSize: "0.85rem",
    fontWeight: "600",
    border: "1px solid #334155",
    marginBottom: "1rem",
  },
  title: {
    fontSize: "2.25rem",
    fontWeight: "800",
    margin: "0 0 0.5rem 0",
    letterSpacing: "-0.025em",
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: "1.1rem",
    margin: "0 0 1.5rem 0",
  },
  statusBox: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 1rem",
    backgroundColor: "#1e293b",
    borderRadius: "8px",
    border: "1px solid #334155",
    fontSize: "0.9rem",
    color: "#cbd5e1",
  },
  dotActive: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "#22c55e",
  },
  dotPulse: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "#eab308",
  },
  grid: {
    maxWidth: "1000px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
    gap: "2rem",
  },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: "12px",
    padding: "1.5rem",
    border: "1px solid #334155",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
  },
  cardTitle: {
    fontSize: "1.25rem",
    margin: "0 0 1.25rem 0",
    color: "#f1f5f9",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  label: {
    display: "block",
    fontSize: "0.85rem",
    color: "#94a3b8",
    marginBottom: "0.35rem",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "6px",
    border: "1px solid #475569",
    backgroundColor: "#0f172a",
    color: "#fff",
    fontSize: "0.95rem",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    height: "100px",
    padding: "0.75rem",
    borderRadius: "6px",
    border: "1px solid #475569",
    backgroundColor: "#0f172a",
    color: "#fff",
    fontSize: "0.95rem",
    boxSizing: "border-box",
    resize: "vertical",
  },
  buttonPrimary: {
    padding: "0.75rem",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  },
  searchForm: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "1.5rem",
  },
  buttonSecondary: {
    padding: "0.75rem 1.25rem",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#0d9488",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  },
  resultsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  emptyText: {
    color: "#64748b",
    fontSize: "0.9rem",
    fontStyle: "italic",
    textAlign: "center",
    padding: "2rem 0",
  },
  resultCard: {
    backgroundColor: "#0f172a",
    borderRadius: "8px",
    padding: "1rem",
    border: "1px solid #334155",
  },
  resultHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.5rem",
  },
  resultTitle: {
    margin: 0,
    fontSize: "1rem",
    color: "#38bdf8",
  },
  scoreBadge: {
    fontSize: "0.75rem",
    fontWeight: "700",
    color: "#4ade80",
    backgroundColor: "#052e16",
    padding: "0.2rem 0.5rem",
    borderRadius: "4px",
  },
  progressBarBackground: {
    width: "100%",
    height: "4px",
    backgroundColor: "#334155",
    borderRadius: "2px",
    marginBottom: "0.75rem",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#22c55e",
  },
  resultContent: {
    margin: 0,
    fontSize: "0.9rem",
    color: "#cbd5e1",
    lineHeight: "1.4",
  },
  loadingContainer: {
    textAlign: "center",
    padding: "3rem",
    color: "#94a3b8",
  },
};