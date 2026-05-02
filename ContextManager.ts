import { App, TFile } from 'obsidian';
import { activeNoteStore } from './store';

export class ContextManager {
    app: App;

    constructor(app: App) {
        this.app = app;
    }

    /**
     * Inicia los listeners para monitorear el estado del workspace
     */
    registerListeners(plugin: any) {
        plugin.registerEvent(
            this.app.workspace.on('file-open', async (file: TFile | null) => {
                await this.handleFileOpen(file);
            })
        );

        // Inicializar con la nota activa actual si existe,
        // pero necesitamos esperar a que el workspace esté listo.
        this.app.workspace.onLayoutReady(() => {
            const activeFile = this.app.workspace.getActiveFile();
            if (activeFile) {
                this.handleFileOpen(activeFile);
            }
        });
    }

    private async handleFileOpen(file: TFile | null) {
        if (!file || file.extension !== 'md') {
            activeNoteStore.set(null);
            return;
        }

        const content = await this.app.vault.read(file);
        // Extraemos solo los primeros 1000 caracteres para el contexto rápido
        // Esto evita sobrecargar la UI y la memoria en notas inmensas
        const snippet = content.substring(0, 1000);

        activeNoteStore.set({
            path: file.path,
            basename: file.basename,
            content: snippet
        });
    }
}
