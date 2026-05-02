<script lang="ts">
    import { activeNoteStore, chatHistoryStore, isTypingStore, activeCampaignSlotStore, ChatMessage } from './store';
    import { onMount } from 'svelte';

    export let plugin: any;

    let inputText = '';
    let messages: ChatMessage[] = [];
    let activeNote: any = null;
    let isTyping = false;
    let activeCampaign = 'Campaña 1';
    let campaigns = ['Campaña 1', 'Campaña 2', 'Campaña 3', 'Campaña 4', 'Campaña 5'];

    chatHistoryStore.subscribe(value => {
        messages = value;
    });

    activeNoteStore.subscribe(value => {
        activeNote = value;
    });

    isTypingStore.subscribe(value => {
        isTyping = value;
    });

    activeCampaignSlotStore.subscribe(value => {
        activeCampaign = value;
    });

    onMount(async () => {
        // Load initial campaign
        const history = await plugin.sessionManager.loadCampaign(activeCampaign);
        chatHistoryStore.set(history);
    });

    async function changeCampaign(event: Event) {
        const select = event.target as HTMLSelectElement;
        const newSlot = select.value;
        activeCampaignSlotStore.set(newSlot);
        const history = await plugin.sessionManager.loadCampaign(newSlot);
        chatHistoryStore.set(history);
    }

    async function clearCampaign() {
        if (confirm(`¿Estás seguro de que deseas limpiar la ${activeCampaign}? Esto sobrescribirá el archivo Markdown.`)) {
            const history = await plugin.sessionManager.clearCampaign(activeCampaign);
            chatHistoryStore.set(history);
        }
    }

    async function sendMessage() {
        if (!inputText.trim() || isTyping) return;
        
        const userMsg = inputText;
        chatHistoryStore.update(history => [
            ...history, 
            { role: 'user', content: userMsg }
        ]);
        inputText = '';
        
        isTypingStore.set(true);
        // Guardar instantáneamente el mensaje del usuario
        await plugin.sessionManager.saveCampaign(activeCampaign, messages);

        const activeText = activeNote ? activeNote.content : '';
        const response = await plugin.dungeonMaster.chat(userMsg, activeText, messages);
        
        chatHistoryStore.update(history => [
            ...history, 
            { role: 'assistant', content: response }
        ]);
        // Guardar instantáneamente la respuesta del DM
        await plugin.sessionManager.saveCampaign(activeCampaign, messages);
        isTypingStore.set(false);
    }

    function quickAction(action: string) {
        let prompt = '';
        switch(action) {
            case 'look':
                prompt = `(Acción) Miro a mi alrededor. ¿Qué veo en este lugar?`;
                break;
            case 'npc':
                prompt = `(Acción) ¿Hay alguien interesante cerca? Genera un NPC que encaje en este lugar.`;
                break;
            case 'roll':
                prompt = `(Acción) Quiero realizar una tirada para investigar u obtener información. ¿Qué debo tirar?`;
                break;
            case 'resume':
                prompt = `(Metajuego) He vuelto a la mesa para retomar la sesión. Haz un breve resumen narrativo sobre la situación actual en la que nos quedamos, e invítame a decir qué hago a continuación.`;
                break;
        }

        inputText = prompt;
        sendMessage();
    }
</script>

<div class="chat-container">
    <div class="campaign-selector">
        <select value={activeCampaign} on:change={changeCampaign}>
            {#each campaigns as camp}
                <option value={camp}>{camp}</option>
            {/each}
        </select>
        <button class="clear-btn" on:click={clearCampaign} title="Limpiar campaña">🧹</button>
    </div>

    {#if activeNote}
        <div class="active-note-indicator">
            <span class="icon">📄</span> Viendo: <strong>[[{activeNote.basename}]]</strong>
        </div>
    {/if}

    <div class="messages">
        {#each messages as msg}
            <div class="message {msg.role}">
                <div class="message-content">
                    {msg.content}
                </div>
            </div>
        {/each}
        {#if isTyping}
            <div class="message assistant">
                <div class="message-content typing">
                    El DM está decidiendo tu destino...
                </div>
            </div>
        {/if}
    </div>

    <div class="input-area">
        <div class="quick-actions">
            <button class="mod-cta action-btn" on:click={() => quickAction('look')}>👀 Observar entorno</button>
            <button class="mod-cta action-btn" on:click={() => quickAction('npc')}>🗣 Buscar a alguien</button>
            <button class="mod-cta action-btn" on:click={() => quickAction('roll')}>🎲 Tirar dados</button>
            <button class="mod-cta action-btn" style="background-color: var(--color-purple); color: white;" on:click={() => quickAction('resume')}>▶️ Retomar sesión</button>
        </div>
        
        <div class="input-wrapper">
            <textarea 
                bind:value={inputText} 
                placeholder="Pregunta sobre tu mundo..." 
                on:keydown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
            ></textarea>
            <button class="send-btn mod-cta" on:click={sendMessage}>Enviar</button>
        </div>
    </div>
</div>

<style>
    .chat-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 10px;
        background-color: var(--background-primary);
        color: var(--text-normal);
        font-family: var(--font-interface);
    }

    .active-note-indicator {
        font-size: 0.85em;
        padding: 8px;
        background-color: var(--background-secondary);
        border-radius: var(--radius-m);
        margin-bottom: 10px;
        border: 1px solid var(--background-modifier-border);
        color: var(--text-muted);
    }

    .messages {
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 10px;
        padding-right: 5px;
    }

    .message {
        display: flex;
        max-width: 90%;
    }

    .message.user {
        align-self: flex-end;
    }

    .message.assistant {
        align-self: flex-start;
    }

    .message-content {
        padding: 8px 12px;
        border-radius: var(--radius-m);
        font-size: var(--font-ui-medium);
        line-height: var(--line-height-normal);
    }

    .message.user .message-content {
        background-color: var(--interactive-accent);
        color: var(--text-on-accent);
        border-bottom-right-radius: 2px;
    }

    .message.assistant .message-content {
        background-color: var(--background-secondary-alt);
        border: 1px solid var(--background-modifier-border);
        border-bottom-left-radius: 2px;
    }

    .input-area {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: auto;
    }

    .quick-actions {
        display: flex;
        gap: 5px;
        flex-wrap: wrap;
    }

    .action-btn {
        font-size: 0.75em;
        padding: 4px 8px;
        height: auto;
        border-radius: var(--radius-s);
        background-color: var(--background-secondary);
        color: var(--text-normal);
        border: 1px solid var(--background-modifier-border);
        cursor: pointer;
    }
    
    .action-btn:hover {
        background-color: var(--background-modifier-hover);
    }

    .input-wrapper {
        display: flex;
        gap: 8px;
    }

    textarea {
        flex: 1;
        resize: none;
        height: 50px;
        min-height: 50px;
        font-family: inherit;
        background-color: var(--background-modifier-form-field);
        border: 1px solid var(--background-modifier-border);
        color: var(--text-normal);
        border-radius: var(--radius-m);
        padding: 8px;
    }

    .send-btn {
        height: 50px;
        width: 60px;
        cursor: pointer;
    }
</style>
