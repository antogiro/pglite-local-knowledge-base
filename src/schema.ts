import { db } from "./db";

export async function initSchema(): Promise<void> {
  await db.exec(`CREATE EXTENSION IF NOT EXISTS vector;`);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS documents (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      source TEXT,
      embedding VECTOR(384) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.exec(`
    CREATE INDEX IF NOT EXISTS documents_embedding_hnsw_idx 
    ON documents 
    USING hnsw (embedding vector_cosine_ops);
  `);
}