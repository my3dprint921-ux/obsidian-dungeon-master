import { App, TFile } from 'obsidian';
import { ChatMessage } from './store';

export class SessionManager {
    app: App;
    folderPath = 'Dnd';

    constructor(app: App) {
        this.app = app;
    }

    /**
     * Asegura que la carpeta Dnd existe.
     */
    async ensureFolderExists() {
        const adapter = this.app.vault.adapter;
        if (!(await adapter.exists(this.folderPath))) {
            await adapter.mkdir(this.folderPath);
        }
    }

    /**
     * Parsea un archivo markdown en una lista de mensajes.
     */
    async loadCampaign(slotName: string): Promise<ChatMessage[]> {
        await this.ensureFolderExists();
        const filePath = `${this.folderPath}/${slotName}.md`;
        const adapter = this.app.vault.adapter;

        if (!(await adapter.exists(filePath))) {
            // Si no existe, inicializamos uno nuevo con el saludo
            const initialHistory: ChatMessage[] = [
                { role: 'assistant', content: '¡Saludos! Soy tu Dungeon Master. ¿Qué deseas explorar o hacer en el mundo de hoy?' }
            ];
            await this.saveCampaign(slotName, initialHistory);
            return initialHistory;
        }

        const content = await adapter.read(filePath);
        return this.parseMarkdownToHistory(content);
    }

    /**
     * Sobrescribe el historial completo al archivo markdown.
     */
    async saveCampaign(slotName: string, history: ChatMessage[]) {
        await this.ensureFolderExists();
        const filePath = `${this.folderPath}/${slotName}.md`;
        const markdown = this.parseHistoryToMarkdown(slotName, history);
        await this.app.vault.adapter.write(filePath, markdown);
    }

    /**
     * Limpia la campaña y la devuelve a su estado inicial.
     */
    async clearCampaign(slotName: string): Promise<ChatMessage[]> {
        const initialHistory: ChatMessage[] = [
            { role: 'assistant', content: '¡Saludos! Soy tu Dungeon Master. ¿Qué deseas explorar o hacer en el mundo de hoy?' }
        ];
        await this.saveCampaign(slotName, initialHistory);
        return initialHistory;
    }

    private parseHistoryToMarkdown(slotName: string, history: ChatMessage[]): string {
        let md = `# Sesión: ${slotName}\n\n`;
        for (const msg of history) {
            const roleName = msg.role === 'assistant' ? 'DM' : 'Tú';
            md += `### ${roleName}\n${msg.content}\n\n`;
        }
        return md;
    }

    private parseMarkdownToHistory(markdown: string): ChatMessage[] {
        const history: ChatMessage[] = [];
        // Separamos el texto por '### '
        const chunks = markdown.split('### ');
        
        // Ignoramos el primer chunk que es el título '# Sesión: ...'
        for (let i = 1; i < chunks.length; i++) {
            const lines = chunks[i].split('\n');
            const roleStr = lines[0].trim();
            const content = lines.slice(1).join('\n').trim();
            
            if (roleStr === 'DM') {
                history.push({ role: 'assistant', content });
            } else if (roleStr === 'Tú') {
                history.push({ role: 'user', content });
            }
        }

        // Fallback en caso de archivo vacío o malformado
        if (history.length === 0) {
            return [{ role: 'assistant', content: '¡Saludos! Soy tu Dungeon Master. ¿Qué deseas explorar o hacer en el mundo de hoy?' }];
        }

        return history;
    }
}
