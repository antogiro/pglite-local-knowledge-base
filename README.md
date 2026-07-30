# PGlite Local Knowledge Base (Golem+ Demo)

Dieses Repository enthält den Beispielcode zum Golem+-Artikel **"Postgres ohne Server – Semantische Suche und Local-First mit PGlite im Browser"**.

Die Anwendung zeigt, wie eine vollständige PostgreSQL-Engine im Browser ausgeführt wird, um Dokumente lokal zu verwalten, Embeddings zu berechnen und Vektorsuchen via `pgvector` durchzuführen.

## Tech-Stack

* **Database:** [PGlite](https://github.com/electric-sql/pglite) (PostgreSQL WASM)
* **Vector Extensions:** `@electric-sql/pglite-pgvector` (HNSW Indexing)
* **Local Embeddings:** `@xenova/transformers` (`all-MiniLM-L6-v2`)
* **Persistence:** Origin Private File System (OPFS)
* **UI:** React + TypeScript + Vite

## Schnelleinstieg

1. **Repository klonen und Abhängigkeiten installieren:**
   ```bash
   npm install

2. Starte den Server mit: npm run dev