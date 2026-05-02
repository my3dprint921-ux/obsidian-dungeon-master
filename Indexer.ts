import { App, TFile } from 'obsidian';

export interface ChunkMetadata {
    path: string;
    filename: string;
    text: string;
}

export class Indexer {
    app: App;

    constructor(app: App) {
        this.app = app;
    }

    /**
     * Escanea todos los archivos .md de la bóveda, realiza chunking y devuelve los metadatos.
     */
    async indexVault(): Promise<ChunkMetadata[]> {
        const files = this.app.vault.getMarkdownFiles();
        const chunks: ChunkMetadata[] = [];
        
        // Procesamiento en batches para no bloquear el hilo principal
        const batchSize = 10;
        for (let i = 0; i < files.length; i += batchSize) {
            const batch = files.slice(i, i + batchSize);
            const batchPromises = batch.map(file => this.processFile(file));
            const batchResults = await Promise.all(batchPromises);
            
            for (const result of batchResults) {
                if (result) {
                    chunks.push(...result);
                }
            }
            // Ceder control al hilo principal (Yield)
            await new Promise(resolve => setTimeout(resolve, 0));
        }
        
        return chunks;
    }

    /**
     * Lee un archivo y lo divide en chunks si no está en un directorio oculto.
     */
    private async processFile(file: TFile): Promise<ChunkMetadata[] | null> {
        // Ignorar carpetas ocultas (ej. .obsidian, .git)
        if (file.path.startsWith('.') || file.path.includes('/.')) {
            return null;
        }

        const content = await this.app.vault.read(file);
        // Aproximación: 500 tokens (1 token ~ 4 caracteres) = 2000 caracteres máximo por chunk
        const fileChunks = this.chunkText(content, 500); 

        return fileChunks.map(text => ({
            path: file.path,
            filename: file.basename,
            text
        }));
    }

    /**
     * Fragmenta el texto respetando los saltos de párrafo.
     */
    private chunkText(text: string, maxTokens: number): string[] {
        const maxChars = maxTokens * 4; 
        const paragraphs = text.split(/\n\s*\n/);
        const chunks: string[] = [];
        
        let currentChunk = '';
        
        for (const paragraph of paragraphs) {
            // Si el párrafo por sí solo excede el límite (caso atípico), lo cortamos drásticamente
            if (paragraph.length > maxChars) {
                if (currentChunk.trim().length > 0) {
                    chunks.push(currentChunk.trim());
                    currentChunk = '';
                }
                
                // Dividir párrafo largo en partes más pequeñas (fallback simple)
                let remaining = paragraph;
                while (remaining.length > 0) {
                    chunks.push(remaining.substring(0, maxChars).trim());
                    remaining = remaining.substring(maxChars);
                }
                continue;
            }

            if ((currentChunk.length + paragraph.length) > maxChars && currentChunk.length > 0) {
                chunks.push(currentChunk.trim());
                currentChunk = '';
            }
            currentChunk += paragraph + '\n\n';
        }
        
        if (currentChunk.trim().length > 0) {
            chunks.push(currentChunk.trim());
        }
        
        return chunks;
    }
}
