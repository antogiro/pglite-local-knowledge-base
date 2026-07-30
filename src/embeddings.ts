import { pipeline, env, FeatureExtractionPipeline } from "@xenova/transformers";

// Verhindert, dass Vite seine 'index.html' als Modell-JSON zurückgibt
env.allowLocalModels = false;

let extractor: FeatureExtractionPipeline | null = null;

export async function getExtractor(): Promise<FeatureExtractionPipeline> {
  if (!extractor) {
    extractor = (await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    )) as FeatureExtractionPipeline;
  }
  return extractor;
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const pipe = await getExtractor();
  const output = await pipe(text, { pooling: "mean", normalize: true });
  return Array.from(output.data);
}