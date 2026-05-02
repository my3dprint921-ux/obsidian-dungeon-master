import { writable } from 'svelte/store';

export interface ActiveNoteState {
    path: string;
    basename: string;
    content: string;
}

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

// Stores
export const activeNoteStore = writable<ActiveNoteState | null>(null);

export const chatHistoryStore = writable<ChatMessage[]>([
    { role: 'assistant', content: '¡Saludos! Soy tu Dungeon Master. ¿Qué deseas explorar o hacer en el mundo de hoy?' }
]);

export const isTypingStore = writable<boolean>(false);

export const activeCampaignSlotStore = writable<string>('Campaña 1');
