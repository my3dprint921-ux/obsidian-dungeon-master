import { App, requestUrl } from 'obsidian';
import { VectorStore } from './VectorStore';
import { ChatMessage } from './store';

export class DungeonMaster {
    app: App;
    apiKey: string;
    vectorStore: VectorStore;

    constructor(app: App, apiKey: string, vectorStore: VectorStore) {
        this.app = app;
        this.apiKey = apiKey;
        this.vectorStore = vectorStore;
    }

    /**
     * Procesa un mensaje del usuario, consulta el lore y devuelve la respuesta del DM.
     */
    async chat(userMessage: string, activeNoteText: string, history: ChatMessage[]): Promise<string> {
        if (!this.apiKey) {
            return "❌ Error: API Key de Gemini no configurada. Por favor, añádela en los ajustes del plugin.";
        }

        // 1. Recuperar contexto (RAG) basado en el mensaje del usuario y la nota activa
        const searchQuery = `${userMessage}\nContexto actual: ${activeNoteText.substring(0, 500)}`;
        const contextEntries = await this.vectorStore.search(searchQuery, 5);
        const contextChunks = contextEntries.map(e => `[${e.metadata.filename}]: ${e.metadata.text}`).join('\n\n');

        // 2. Preparar el System Prompt
        const systemPrompt = `
Eres un Dungeon Master (DM) experto, inmersivo y creativo. Estás dirigiendo una partida de rol basada ÚNICAMENTE en el lore y el mundo que se describe en el "CONTEXTO DEL LORE".
Tu objetivo es narrar la historia, describir los entornos, interpretar a los NPCs y reaccionar a las acciones del jugador.
Reglas:
1. Mantén siempre el personaje. Nunca rompas la cuarta pared a menos que sea para aclarar una regla mecánica.
2. Usa el CONTEXTO DEL LORE para describir el mundo, los personajes, facciones o reglas mágicas.
3. Si el jugador intenta algo que el lore contradice, describe las consecuencias de forma narrativa.
4. Sé conciso pero evocador en tus descripciones. No escribas monólogos largos. Deja que el jugador actúe.
5. Puedes pedirle al jugador que "tire los dados" (ej. "Tira Percepción", "Haz una tirada de iniciativa") cuando quiera realizar una acción con probabilidad de fallo.
6. IMPORTANTE: Modula tu personalidad y extensión para que tus respuestas siempre concluyan sus ideas de manera natural y no se corten a la mitad. Tu límite de atención es de unas 1000 palabras, así que asegúrate de poner un punto final y ceder el turno al jugador antes de extenderte demasiado.

--- CONTEXTO DEL LORE (Tu Mundo) ---
${contextChunks || 'El mundo es un misterio sin notas. Improvisa basándote en la nota activa.'}

--- NOTA ACTIVA ACTUAL (Dónde podría estar el jugador) ---
${activeNoteText.substring(0, 1000)}
`;

        // 3. Formatear el historial de chat para la API de Gemini asegurando alternancia estricta
        // (Gemini requiere que el primer mensaje sea 'user' y que los roles se alternen sin repetirse).
        const contents: any[] = [];
        
        for (const msg of history) {
            const role = msg.role === 'user' ? 'user' : 'model';
            // Si el rol es el mismo que el anterior, concatenamos el texto para no romper la alternancia
            if (contents.length > 0 && contents[contents.length - 1].role === role) {
                contents[contents.length - 1].parts[0].text += '\n\n' + msg.content;
            } else {
                contents.push({
                    role: role,
                    parts: [{ text: msg.content }]
                });
            }
        }

        // Asegurarse de que el primer mensaje sea 'user' y contenga el System Prompt
        if (contents.length === 0 || contents[0].role !== 'user') {
            // Si no hay mensajes o el primero es del 'model', insertamos el system prompt como 'user'
            contents.unshift({
                role: "user",
                parts: [{ text: systemPrompt }]
            });
        } else {
            // Si el primero ya es 'user', le prependemos el system prompt
            contents[0].parts[0].text = systemPrompt + '\n\n---\n\n' + contents[0].parts[0].text;
        }

        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${this.apiKey}`;
            const response = await requestUrl({
                url,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                throw: false,
                body: JSON.stringify({
                    contents: contents,
                    generationConfig: {
                        temperature: 0.7, // Un poco de creatividad
                        maxOutputTokens: 2000
                    }
                })
            });

            if (response.status === 200 && response.json?.candidates?.[0]?.content?.parts?.[0]?.text) {
                return response.json.candidates[0].content.parts[0].text;
            } else {
                console.error("Gemini Response Error:", response.json || response.text);
                const errorMsg = response.json?.error?.message || response.text || "Desconocido";
                return `❌ Error de Gemini (${response.status}): ${errorMsg}`;
            }
        } catch (error) {
            console.error("Error contactando al DM (Gemini):", error);
            return `❌ El DM perdió la conexión con el mundo astral: ${error.message || error}`;
        }
    }
}
