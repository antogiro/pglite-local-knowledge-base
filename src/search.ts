import { db } from "./db";

export interface DocumentInput {
  title: string;
  content: string;
  source?: string;
  embedding: number[];
}

export interface SearchResult {
  id: number;
  title: string;
  content: string;
  source: string;
  similarity: number;
}

// Dokument samt Vektor speichern
export async function insertDocument(doc: DocumentInput): Promise<void> {
  const vectorStr = `[${doc.embedding.join(",")}]`;

  await db.query(
    `INSERT INTO documents (title, content, source, embedding) 
     VALUES ($1, $2, $3, $4::vector)`,
    [doc.title, doc.content, doc.source || "manual", vectorStr]
  );
}

// Semantische Suche mit robuster Vektor-Konvertierung
export async function searchDocuments(
  queryEmbedding: number[],
  limit = 5
): Promise<SearchResult[]> {
  const vectorStr = `[${queryEmbedding.join(",")}]`;

  // Wir nutzen explicit casting in SQL
  const result = await db.query<SearchResult>(
    `SELECT 
       id, 
       title, 
       content, 
       source,
       1 - (embedding <=> $1::vector) AS similarity
     FROM documents
     ORDER BY embedding <=> $1::vector ASC
     LIMIT $2`,
    [vectorStr, limit]
  );

  return result.rows;
}