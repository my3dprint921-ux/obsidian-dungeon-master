import { App, requestUrl } from 'obsidian';
import { VectorStore } from './VectorStore';

export interface Contradiction {
    textFragment: string;
    reason: string;
}

export class LogicOracle {
    app: App;
    apiKey: string;
    vectorStore: VectorStore;

    constructor(app: App, apiKey: string, vectorStore: VectorStore) {
        this.app = app;
        this.apiKey = apiKey;
        this.vectorStore = vectorStore;
    }

    /**
     * Evalúa la consistencia de la nota activa comparándola con el lore recuperado (RAG) vía Gemini API.
     */
    async checkConsistency(activeNoteText: string): Promise<Contradiction[]> {
        if (!this.apiKey) {
            console.error("Gemini API key missing.");
            return [];
        }

        // Recuperar contexto (RAG) basado en el texto de la nota
        const contextEntries = await this.vectorStore.search(activeNoteText, 5);
        const contextChunks = contextEntries.map(e => `[${e.metadata.filename}]: ${e.metadata.text}`).join('\n\n');

        const systemPrompt = `
Eres un Editor de Continuidad experto para una saga de ciencia ficción y fantasía.
Tu objetivo es analizar el borrador actual (Nota Activa) y compararlo con el conocimiento establecido del mundo (Contexto del Lore).
Debes identificar ÚNICAMENTE contradicciones lógicas, de tiempo, geográficas o de estado de los personajes.
Ignora errores tipográficos o de estilo.

Responde ESTRICTAMENTE en formato JSON, sin markdown adicional, con la siguiente estructura:
{
    "contradictions": [
        {
            "textFragment": "Cita exacta del borrador que es contradictoria",
            "reason": "Explicación breve de por qué contradice el lore establecido"
        }
    ]
}
Si no hay contradicciones, retorna {"contradictions": []}.
`;

        const userPrompt = `
--- CONTEXTO DEL LORE (Verdad Establecida) ---
${contextChunks || 'No hay contexto disponible.'}

--- NOTA ACTIVA (Borrador a Evaluar) ---
${activeNoteText}
`;

        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${this.apiKey}`;
            const response = await requestUrl({
                url,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [
                        { role: "user", parts: [{ text: systemPrompt + "\n\n" + userPrompt }] }
                    ],
                    generationConfig: {
                        responseMimeType: "application/json"
                    }
                })
            });

            if (response.status === 200 && response.json.candidates?.[0]?.content?.parts?.[0]?.text) {
                const jsonText = response.json.candidates[0].content.parts[0].text;
                const result = JSON.parse(jsonText);
                return result.contradictions || [];
            }
        } catch (error) {
            console.error("Error validando consistencia con Gemini:", error);
        }

        return [];
    }

    /**
     * Resalta el texto contradictorio en el editor activo inyectando tags HTML <mark>.
     * Nota: En producción, es ideal usar CodeMirror 6 Decorations para no ensuciar el markdown subyacente.
     */
    highlightContradictions(contradictions: Contradiction[]) {
        const activeEditor = this.app.workspace.activeEditor?.editor;
        if (!activeEditor) return;

        const documentText = activeEditor.getValue();
        let updatedText = documentText;

        for (const c of contradictions) {
            if (updatedText.includes(c.textFragment) && !updatedText.includes(`<mark>${c.textFragment}</mark>`)) {
                // Inyectar etiqueta mark para el CSS de Obsidian
                // Añadimos un pequeño comentario HTML o un title si se desea, por simplicidad usamos mark directo
                updatedText = updatedText.replace(c.textFragment, `<mark class="worldbuilder-contradiction" title="${c.reason}">${c.textFragment}</mark>`);
            }
        }

        if (updatedText !== documentText) {
            activeEditor.setValue(updatedText);
        }
    }
}
