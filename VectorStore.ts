import { App, requestUrl } from 'obsidian';
import { ChunkMetadata } from './Indexer';

export interface VectorEntry {
    metadata: ChunkMetadata;
    embedding: number[];
}

export class VectorStore {
    app: App;
    apiKey: string;
    store: VectorEntry[] = [];
    storePath: string = '.obsidian/plugins/worldbuilding-assistant/embeddings.json';

    constructor(app: App, apiKey: string) {
        this.app = app;
        this.apiKey = apiKey;
    }

    /**
     * Carga los embeddings desde el disco usando el adaptador de Obsidian.
     */
    async loadStore(): Promise<void> {
        try {
            const adapter = this.app.vault.adapter;
            if (await adapter.exists(this.storePath)) {
                const data = await adapter.read(this.storePath);
                this.store = JSON.parse(data);
                console.log(`Loaded ${this.store.length} embeddings from local store.`);
            }
        } catch (error) {
            console.error("Error loading vector store:", error);
        }
    }

    /**
     * Guarda los embeddings actuales en el disco.
     */
    async saveStore(): Promise<void> {
        try {
            const adapter = this.app.vault.adapter;
            
            // Asegurarnos de que el directorio del plugin exista
            const dirPath = '.obsidian/plugins/worldbuilding-assistant';
            if (!(await adapter.exists(dirPath))) {
                await adapter.mkdir(dirPath);
            }

            await adapter.write(this.storePath, JSON.stringify(this.store));
            console.log(`Saved ${this.store.length} embeddings to store.`);
        } catch (error) {
            console.error("Error saving vector store:", error);
        }
    }

    /**
     * Obtiene el embedding utilizando la API de Google Gemini (text-embedding-004).
     */
    async getEmbedding(text: string): Promise<number[] | null> {
        if (!this.apiKey) {
            console.error("Gemini API Key is missing. Please set it in the plugin settings.");
            return null;
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${this.apiKey}`;
        
        try {
            const response = await requestUrl({
                url: url,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: "models/text-embedding-004",
                    content: {
                        parts: [{ text }]
                    }
                })
            });

            if (response.status === 200 && response.json.embedding) {
                return response.json.embedding.values;
            } else {
                console.error("Gemini API Error:", response.text);
                return null;
            }
        } catch (error) {
            console.error("Failed to fetch embedding:", error);
            return null;
        }
    }

    /**
     * Procesa un array de chunks y genera sus embeddings.
     */
    async addChunks(chunks: ChunkMetadata[]): Promise<void> {
        // En un entorno de producción, dividimos en pequeños batches para 
        // respetar los límites de la API de Gemini (rate limits).
        const batchSize = 5;
        let processed = 0;

        for (let i = 0; i < chunks.length; i += batchSize) {
            const batch = chunks.slice(i, i + batchSize);
            const promises = batch.map(async (chunk) => {
                // Verificar si ya existe en el store (usamos la ruta y el texto como ID compuesto)
                const exists = this.store.find(e => e.metadata.path === chunk.path && e.metadata.text === chunk.text);
                if (exists) return;

                const embedding = await this.getEmbedding(chunk.text);
                if (embedding) {
                    this.store.push({ metadata: chunk, embedding });
                }
            });

            await Promise.all(promises);
            processed += batch.length;
            console.log(`Vectorized ${processed}/${chunks.length} chunks...`);
            
            // Pequeño delay para no saturar la API
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Guardar automáticamente después de indexar
        await this.saveStore();
    }

    /**
     * Búsqueda semántica usando similitud del coseno.
     * Retorna los topK chunks más relevantes.
     */
    async search(query: string, topK: number = 5): Promise<VectorEntry[]> {
        const queryEmbedding = await this.getEmbedding(query);
        if (!queryEmbedding) return [];

        const results = this.store.map(entry => {
            return {
                entry,
                similarity: this.cosineSimilarity(queryEmbedding, entry.embedding)
            };
        });

        // Ordenar descendentemente por mayor similitud
        results.sort((a, b) => b.similarity - a.similarity);

        return results.slice(0, topK).map(r => r.entry);
    }

    /**
     * Calcula la similitud del coseno entre dos vectores (embeddings).
     */
    private cosineSimilarity(vecA: number[], vecB: number[]): number {
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        for (let i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }
        if (normA === 0 || normB === 0) return 0;
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }
}
