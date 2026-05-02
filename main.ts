import { App, Plugin, PluginSettingTab, Setting, WorkspaceLeaf, ItemView, Notice } from 'obsidian';
import ChatApp from './ChatApp.svelte';
import { ContextManager } from './ContextManager';
import { VectorStore } from './VectorStore';
import { LogicOracle } from './LogicOracle';
import { DungeonMaster } from './DungeonMaster';
import { Indexer } from './Indexer';
import { SessionManager } from './SessionManager';

// Define the interface for plugin settings
interface WorldbuildingSettings {
	llmProvider: 'gemini' | 'openai' | 'claude' | 'ollama';
	apiKey: string;
	ollamaUrl: string;
}

const DEFAULT_SETTINGS: WorldbuildingSettings = {
	llmProvider: 'gemini',
	apiKey: '',
	ollamaUrl: 'http://localhost:11434'
}

// Define the view type for the chat
export const VIEW_TYPE_CHAT = "worldbuilding-chat-view";

// Create the ItemView for the Chat Sidebar
export class ChatView extends ItemView {
	component: any; // Svelte component instance

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return VIEW_TYPE_CHAT;
	}

	getDisplayText() {
		return "Worldbuilding Chat";
	}

	async onOpen() {
		const container = this.containerEl.children[1];
		container.empty();
		
		// Mount the Svelte application
		this.component = new ChatApp({
			target: container,
			props: {
				plugin: this.app.plugins.getPlugin('worldbuilding-assistant')
			}
		});
	}

	async onClose() {
		if (this.component) {
			this.component.$destroy();
		}
	}
}

export default class WorldbuildingPlugin extends Plugin {
	settings: WorldbuildingSettings;
	contextManager: ContextManager;
	vectorStore: VectorStore;
	logicOracle: LogicOracle;
	dungeonMaster: DungeonMaster;
	sessionManager: SessionManager;

	async onload() {
		await this.loadSettings();

		this.contextManager = new ContextManager(this.app);
		this.contextManager.registerListeners(this);
		
		this.vectorStore = new VectorStore(this.app, this.settings.apiKey);
		await this.vectorStore.loadStore();
		
		this.logicOracle = new LogicOracle(this.app, this.settings.apiKey, this.vectorStore);
		this.dungeonMaster = new DungeonMaster(this.app, this.settings.apiKey, this.vectorStore);
		this.sessionManager = new SessionManager(this.app);

		// Register the Chat View
		this.registerView(
			VIEW_TYPE_CHAT,
			(leaf) => new ChatView(leaf)
		);

		// Add Ribbon Icon to open the Chat View
		this.addRibbonIcon('messages-square', 'Open Worldbuilding Chat', () => {
			this.activateView();
		});

		// Add a command to open the view via Command Palette
		this.addCommand({
			id: 'open-worldbuilding-chat',
			name: 'Open Worldbuilding Chat',
			callback: () => {
				this.activateView();
			}
		});

		// Add a command to index the vault
		this.addCommand({
			id: 'index-worldbuilding-vault',
			name: 'Index Vault for Dungeon Master (RAG)',
			callback: async () => {
				new Notice('Empezando a escanear e indexar la bóveda... El DM está estudiando.');
				try {
					const indexer = new Indexer(this.app);
					const chunks = await indexer.indexVault();
					await this.vectorStore.addChunks(chunks);
					new Notice(`¡Éxito! El DM aprendió ${chunks.length} fragmentos de lore.`);
				} catch (error) {
					console.error("Error indexing:", error);
					new Notice('Error al indexar la bóveda. Revisa la consola.');
				}
			}
		});

		// Add settings tab
		this.addSettingTab(new WorldbuildingSettingTab(this.app, this));
	}

	onunload() {
		// Clean up on unload
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
		if (this.dungeonMaster) this.dungeonMaster.apiKey = this.settings.apiKey;
		if (this.vectorStore) this.vectorStore.apiKey = this.settings.apiKey;
		if (this.logicOracle) this.logicOracle.apiKey = this.settings.apiKey;
	}

	async activateView() {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(VIEW_TYPE_CHAT);

		if (leaves.length > 0) {
			// A leaf with our view already exists, use that
			leaf = leaves[0];
		} else {
			// Our view could not be found in the workspace, create a new leaf
			// in the right sidebar for it
			leaf = workspace.getRightLeaf(false);
			if (leaf) {
				await leaf.setViewState({ type: VIEW_TYPE_CHAT, active: true });
			}
		}

		// "Reveal" the leaf in case it is in a collapsed sidebar
		if (leaf) {
			workspace.revealLeaf(leaf);
		}
	}
}

class WorldbuildingSettingTab extends PluginSettingTab {
	plugin: WorldbuildingPlugin;

	constructor(app: App, plugin: WorldbuildingPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('LLM Provider')
			.setDesc('Choose your preferred LLM provider')
			.addDropdown(dropdown => dropdown
				.addOption('gemini', 'Google Gemini')
				.addOption('ollama', 'Ollama (Local)')
				.addOption('openai', 'OpenAI')
				.addOption('claude', 'Anthropic Claude')
				.setValue(this.plugin.settings.llmProvider)
				.onChange(async (value: 'gemini' | 'openai' | 'claude' | 'ollama') => {
					this.plugin.settings.llmProvider = value;
					await this.plugin.saveSettings();
					this.display(); // Refresh to show/hide relevant settings
				}));

		if (this.plugin.settings.llmProvider === 'ollama') {
			new Setting(containerEl)
				.setName('Ollama URL')
				.setDesc('Default is http://localhost:11434')
				.addText(text => text
					.setPlaceholder('http://localhost:11434')
					.setValue(this.plugin.settings.ollamaUrl)
					.onChange(async (value) => {
						this.plugin.settings.ollamaUrl = value;
						await this.plugin.saveSettings();
					}));
		} else {
			new Setting(containerEl)
				.setName('API Key')
				.setDesc(`API Key for ${this.plugin.settings.llmProvider}`)
				.addText(text => text
					.setPlaceholder('Enter your API key')
					.setValue(this.plugin.settings.apiKey)
					.onChange(async (value) => {
						this.plugin.settings.apiKey = value;
						await this.plugin.saveSettings();
					}));
		}
	}
}
