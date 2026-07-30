import { PGlite } from "@electric-sql/pglite";
import { vector } from "@electric-sql/pglite/vector";

// PGlite Instanz mit OPFS-Persistenz und pgvector Extension
export const db = new PGlite({
  dataDir: "idb://knowledge-base-db",
  extensions: {
    vector,
  },
});