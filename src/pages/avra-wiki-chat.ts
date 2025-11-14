// Page: Avra Wiki Chat

import { API } from "@/constants";
import { sidebar } from "@/modules/wiki/sidebar";

interface ChatChunk {
    delta: string;
}

interface ChatError {
    error: string;
}

interface ChatSource {
    file_id: string;
    title: string;
    url: string;
}

interface ChatFinal {
    response: string;
    sources: ChatSource[];
}

type ChatEvent = ChatChunk | ChatError | ChatFinal;

interface ChatMessage {
    role: "user" | "assistant";
    content: string;
    sources?: ChatSource[];
    isError?: boolean;
}

class AvraChatClient {
    private abortController: AbortController | null = null;

    async sendMessage(
        message: string,
        callbacks: {
            onChunk?: (delta: string) => void;
            onError?: (error: string) => void;
            onFinal?: (response: string, sources: ChatSource[]) => void;
            onComplete?: () => void;
        }
    ) {
        // Cancel any existing request
        this.abort();

        this.abortController = new AbortController();

        // SIMULATED RESPONSE - Replace with real API call later
        // try {
        //     const loremIpsum =
        //         "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

        //     const words = loremIpsum.split(" ");

        //     // Simulate streaming by sending words one at a time
        //     for (let i = 0; i < words.length; i++) {
        //         // Check if aborted
        //         if (this.abortController?.signal.aborted) {
        //             console.log("Request aborted");
        //             return;
        //         }

        //         const word = words[i] + (i < words.length - 1 ? " " : "");
        //         callbacks.onChunk?.(word);

        //         // Small delay to simulate streaming
        //         await new Promise((resolve) => setTimeout(resolve, 50));
        //     }

        //     // Simulate sources
        //     const mockSources: ChatSource[] = [
        //         { file_id: "1", title: "Wiki Article 1", url: "/wiki/article-1" },
        //         { file_id: "2", title: "Session Insight 2", url: "/session-insights/insight-2" },
        //     ];

        //     callbacks.onFinal?.(loremIpsum, mockSources);
        //     callbacks.onComplete?.();
        // } catch (error) {
        //     if (error instanceof Error && error.name === "AbortError") {
        //         console.log("Request aborted");
        //         return;
        //     }
        //     console.error("Chat request failed:", error);
        //     callbacks.onError?.(error instanceof Error ? error.message : "Unknown error");
        // }

        // REAL API CALL - Commented out for now
        try {
            const response = await fetch(`${API}/api/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message }),
                signal: this.abortController.signal,
            });

            if (!response.ok) {
                const errorData = await response.json();
                callbacks.onError?.(errorData.error || `Request failed with status ${response.status}`);
                return;
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) {
                callbacks.onError?.("No response body");
                return;
            }

            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();

                if (done) {
                    callbacks.onComplete?.();
                    break;
                }

                // Decode the chunk and add to buffer
                buffer += decoder.decode(value, { stream: true });

                // Process complete SSE messages
                const lines = buffer.split("\n");
                buffer = lines.pop() || ""; // Keep incomplete line in buffer

                for (const line of lines) {
                    if (!line.trim() || line.startsWith(":")) {
                        continue; // Skip empty lines and comments
                    }

                    if (line.startsWith("data: ")) {
                        const data = line.slice(6); // Remove 'data: ' prefix

                        try {
                            const event: ChatEvent = JSON.parse(data);

                            if ("delta" in event) {
                                callbacks.onChunk?.(event.delta);
                            } else if ("error" in event) {
                                callbacks.onError?.(event.error);
                            } else if ("response" in event) {
                                callbacks.onFinal?.(event.response, event.sources);
                            }
                        } catch (e) {
                            console.error("Failed to parse SSE data:", data, e);
                        }
                    }
                }
            }
        } catch (error) {
            if (error instanceof Error && error.name === "AbortError") {
                console.log("Request aborted");
                return;
            }
            console.error("Chat request failed:", error);
            callbacks.onError?.(error instanceof Error ? error.message : "Unknown error");
        }
    }

    abort() {
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }
    }
}

// Chat UI Manager
class ChatUI {
    private chatClient: AvraChatClient;
    private messages: ChatMessage[] = [];
    private container: HTMLElement;
    private messagesContainer: HTMLElement;
    private inputContainer: HTMLElement;
    private textarea: HTMLTextAreaElement;
    private sendButton: HTMLButtonElement;
    private currentAssistantMessage: HTMLElement | null = null;
    private loadingIndicatorElement: HTMLElement | null = null;
    private suggestedQuestionsElement: HTMLElement | null = null;
    private responseBuffer: string = "";
    private displayedText: string = "";
    private renderInterval: number | null = null;

    constructor() {
        this.chatClient = new AvraChatClient();
        this.container = this.createChatContainer();
        this.messagesContainer = this.createMessagesContainer();
        this.inputContainer = this.createInputContainer();
        this.textarea = this.createTextarea();
        this.sendButton = this.createSendButton();

        this.setupLayout();
        this.setupEventListeners();
        this.showSuggestedQuestions();
    }

    private createChatContainer(): HTMLElement {
        const container = document.createElement("div");
        container.style.cssText = `
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
            justify-content: space-between;
        `;
        return container;
    }

    private createMessagesContainer(): HTMLElement {
        const container = document.createElement("div");
        container.style.cssText = `
            width: 100%;
            padding: 2rem;
            padding-bottom: 150px;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        `;
        return container;
    }

    private createInputContainer(): HTMLElement {
        const container = document.createElement("div");
        container.style.cssText = `
            position: sticky;
            bottom: 0;
            padding: 1.5rem;
            z-index: 100;
        `;
        return container;
    }

    private createTextarea(): HTMLTextAreaElement {
        const textarea = document.createElement("textarea");
        textarea.placeholder = "Ask me a question";
        textarea.rows = 1;
        textarea.style.cssText = `
            width: 100%;
            height: 64px;
            padding: 1.25rem 4rem 1.25rem 1.5rem;
            border: 2px solid #C8C8C8;
            border-radius: 15px;
            font-family: inherit;
            font-size: 18px;
            resize: none;
            line-height: 1.1;
            background: #fff;
            color: #212121;
            box-sizing: border-box;
            overflow-y: auto;
        `;
        return textarea;
    }

    private createSendButton(): HTMLButtonElement {
        const button = document.createElement("button");
        button.disabled = true;
        button.innerHTML = `<svg width="24" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.1017 0.755249L27 11.0818M27 11.0818L15.1017 22.7552M27 11.0818H0" stroke="#C8C8C8" stroke-width="2"/>
</svg>`;
        button.style.cssText = `
            position: absolute;
            right: 2.25rem;
            bottom: 2.55rem;
            width: 40px;
            height: 40px;
            background: #E9E7E1;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
            padding: 0;
        `;
        return button;
    }

    private updateSendButtonStyle(): void {
        if (this.sendButton.disabled) {
            this.sendButton.style.background = "#E9E7E1";
            const svg = this.sendButton.querySelector("path");
            if (svg) svg.setAttribute("stroke", "#C8C8C8");
        } else {
            this.sendButton.style.background = "#212121";
            const svg = this.sendButton.querySelector("path");
            if (svg) svg.setAttribute("stroke", "#FFFFFF");
        }
    }

    private setupLayout(): void {
        this.inputContainer.appendChild(this.textarea);
        this.inputContainer.appendChild(this.sendButton);
        this.container.appendChild(this.messagesContainer);
        this.container.appendChild(this.inputContainer);

        // Add to page
        const mainContent = document.querySelector("[avra-element='wiki-main-content']");
        if (mainContent) {
            mainContent.innerHTML = "";
            mainContent.appendChild(this.container);
        }
    }

    private setupEventListeners(): void {
        // Update send button state on input
        this.textarea.addEventListener("input", () => {
            this.sendButton.disabled = !this.textarea.value.trim();
            this.updateSendButtonStyle();
        });

        // Send on Enter (Shift+Enter for new line)
        this.textarea.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (!this.sendButton.disabled) {
                    this.handleSend();
                }
            }
        });

        // Send button
        this.sendButton.addEventListener("click", () => this.handleSend());

        // Hover effect for send button
        this.sendButton.addEventListener("mouseenter", () => {
            if (!this.sendButton.disabled) {
                this.sendButton.style.background = "#000000";
            }
        });
        this.sendButton.addEventListener("mouseleave", () => {
            this.updateSendButtonStyle();
        });
    }

    private startLetterByLetterRender(): void {
        if (this.renderInterval) return; // Already rendering

        this.renderInterval = window.setInterval(() => {
            if (this.displayedText.length < this.responseBuffer.length) {
                // Add next character
                this.displayedText = this.responseBuffer.substring(0, this.displayedText.length + 1);

                if (this.currentAssistantMessage) {
                    const contentEl = this.currentAssistantMessage.querySelector(".message-content") as HTMLElement;
                    if (contentEl) {
                        contentEl.textContent = this.displayedText;
                    }
                }
                this.scrollToBottom();
            }
        }, 15);
    }

    private stopLetterByLetterRender(): void {
        if (this.renderInterval) {
            clearInterval(this.renderInterval);
            this.renderInterval = null;
        }
    }

    private showSuggestedQuestions(): void {
        const questions = [
            "What are your best hiring practices?",
            "How do you manage executives?",
            "What strategies do you use for team collaboration?",
            "How do you measure employee performance?",
            "What tools do you find most helpful for project management?",
        ];

        const container = document.createElement("div");
        container.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 20px;
            max-width: 400px;
        `;

        questions.forEach((question, index) => {
            const button = document.createElement("button");
            button.textContent = question;
            button.style.cssText = `
                padding: 1rem 1rem;
                background: transparent;
                color: #A3A3A3;
                border: none;
                border-bottom: 1px solid #DCDCDC;
                text-align: left;
                font-family: inherit;
                font-size: 0.95rem;
                cursor: pointer;
                transition: color 0.2s;
            `;

            button.addEventListener("mouseenter", () => {
                button.style.color = "#212121";
            });
            button.addEventListener("mouseleave", () => {
                button.style.color = "#A3A3A3";
            });
            button.addEventListener("click", () => {
                this.textarea.value = question;
                this.sendButton.disabled = false;
                this.updateSendButtonStyle();
                this.textarea.focus();
            });

            container.appendChild(button);
        });

        this.suggestedQuestionsElement = container;
        this.messagesContainer.appendChild(container);
    }

    private async handleSend(): Promise<void> {
        const message = this.textarea.value.trim();
        if (!message) return;

        // Remove suggested questions on first message
        if (this.suggestedQuestionsElement) {
            this.suggestedQuestionsElement.remove();
            this.suggestedQuestionsElement = null;
        }

        // Disable input while processing
        this.textarea.disabled = true;
        this.sendButton.disabled = true;

        // Add user message
        this.addUserMessage(message);

        // Clear input
        this.textarea.value = "";

        // Show standalone loading indicator
        this.loadingIndicatorElement = this.createStandaloneLoadingIndicator();
        this.messagesContainer.appendChild(this.loadingIndicatorElement);
        this.scrollToBottom();

        // Reset buffers
        this.responseBuffer = "";
        this.displayedText = "";
        this.stopLetterByLetterRender();

        // Send message
        let fullResponse = "";
        let sources: ChatSource[] = [];
        let firstChunk = true;

        await this.chatClient.sendMessage(message, {
            onChunk: (delta) => {
                fullResponse += delta;
                this.responseBuffer = fullResponse;

                if (firstChunk) {
                    // Remove loading indicator and create actual message bubble
                    if (this.loadingIndicatorElement) {
                        this.loadingIndicatorElement.remove();
                        this.loadingIndicatorElement = null;
                    }

                    // Create assistant message bubble
                    this.currentAssistantMessage = this.createAssistantMessageElement();
                    this.messagesContainer.appendChild(this.currentAssistantMessage);

                    // Start letter-by-letter rendering
                    this.startLetterByLetterRender();
                    firstChunk = false;
                }
            },
            onError: (error) => {
                this.stopLetterByLetterRender();

                // Remove loading indicator
                if (this.loadingIndicatorElement) {
                    this.loadingIndicatorElement.remove();
                    this.loadingIndicatorElement = null;
                }

                // Create error message bubble if it doesn't exist
                if (!this.currentAssistantMessage) {
                    this.currentAssistantMessage = this.createAssistantMessageElement();
                    this.messagesContainer.appendChild(this.currentAssistantMessage);
                }

                const contentEl = this.currentAssistantMessage.querySelector(".message-content") as HTMLElement;
                if (contentEl) {
                    contentEl.textContent = `Error: ${error}`;
                    contentEl.style.color = "#c53030";
                }

                this.messages.push({
                    role: "assistant",
                    content: error,
                    isError: true,
                });
            },
            onFinal: (response, srcs) => {
                sources = srcs;
                // Wait for rendering to complete before adding sources
                const checkComplete = setInterval(() => {
                    if (this.displayedText.length >= this.responseBuffer.length) {
                        clearInterval(checkComplete);
                        this.stopLetterByLetterRender();
                        if (sources.length > 0 && this.currentAssistantMessage) {
                            console.log("final response", response);
                            this.addSourcesToMessage(this.currentAssistantMessage, sources);
                        }
                    }
                }, 50);
            },
            onComplete: () => {
                // Wait for all text to be displayed before completing
                const checkComplete = setInterval(() => {
                    if (this.displayedText.length >= this.responseBuffer.length) {
                        clearInterval(checkComplete);
                        this.stopLetterByLetterRender();
                        this.messages.push({
                            role: "assistant",
                            content: fullResponse,
                            sources,
                        });
                        this.currentAssistantMessage = null;
                        this.textarea.disabled = false;
                        this.textarea.focus();
                    }
                }, 50);
            },
        });
    }

    private addUserMessage(content: string): void {
        this.messages.push({ role: "user", content });
        const messageEl = this.createUserMessageElement(content);
        this.messagesContainer.appendChild(messageEl);
        this.scrollToBottom();
    }

    private createUserMessageElement(content: string): HTMLElement {
        const wrapper = document.createElement("div");
        wrapper.style.cssText = `
            display: flex;
            justify-content: flex-end;
        `;

        const messageEl = document.createElement("div");
        messageEl.className = "message-content";
        messageEl.textContent = content;
        messageEl.style.cssText = `
            max-width: 70%;
            padding: 1rem 1.25rem;
            background: #E3E0D9;
            color: #212121;
            border-radius: 12px;
            border-bottom-right-radius: 0px;
            white-space: pre-wrap;
            word-wrap: break-word;
            line-height: 1.5;
            position: relative;
        `;

        // Add chat bubble corner
        const corner = document.createElement("div");
        corner.innerHTML = `<svg width="20" height="13" viewBox="0 0 20 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20 0C20 0 -8.04282 4.04995e-05 2.28369 2.64655e-05C12.6102 1.24315e-05 20 13 20 13V0Z" fill="#E3E0D9"/>
</svg>`;
        corner.style.cssText = `
            position: absolute;
            bottom: -6px;
            right: 0px;
            width: 20px;
            height: 13px;
        `;
        messageEl.appendChild(corner);

        wrapper.appendChild(messageEl);
        return wrapper;
    }

    private createAssistantMessageElement(): HTMLElement {
        const wrapper = document.createElement("div");
        wrapper.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        `;

        const messageEl = document.createElement("div");
        messageEl.style.cssText = `
            max-width: 70%;
            padding: 1rem 1.25rem;
            background: #fff;
            color: #212121;
            border: 1px solid #e5e5e5;
            border-radius: 12px;
            border-bottom-left-radius: 0px;
            white-space: pre-wrap;
            word-wrap: break-word;
            line-height: 1.5;
            position: relative;
        `;

        const contentEl = document.createElement("div");
        contentEl.className = "message-content";
        messageEl.appendChild(contentEl);

        // Add chat bubble corner
        const corner = document.createElement("div");
        corner.innerHTML = `<svg width="20" height="13" viewBox="0 0 20 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 0C0 0 28.0428 4.04995e-05 17.7163 2.64655e-05C7.38981 1.24315e-05 0 13 0 13V0Z" fill="white"/>
</svg>`;
        corner.style.cssText = `
            position: absolute;
            bottom: -6px;
            left: 0px;
            width: 20px;
            height: 13px;
        `;
        messageEl.appendChild(corner);

        wrapper.appendChild(messageEl);
        return wrapper;
    }

    private createStandaloneLoadingIndicator(): HTMLElement {
        const wrapper = document.createElement("div");
        wrapper.style.cssText = `
            display: flex;
            justify-content: flex-start;
        `;

        const loadingEl = this.createLoadingIndicator();
        wrapper.appendChild(loadingEl);

        return wrapper;
    }

    private createLoadingIndicator(): HTMLElement {
        const container = document.createElement("div");
        container.className = "loading-indicator";
        container.style.cssText = `
            display: flex;
            gap: 8px;
            align-items: center;
            padding: 4px 0;
        `;

        // Add styles for animation
        const style = document.createElement("style");
        style.textContent = `
            @keyframes color-fade {
                0%, 100% {
                    background-color: #DBD7CA;
                }
                50% {
                    background-color: #FFFDF9;
                }
            }

            .loading-circle {
                animation: color-fade 1.5s ease-in-out infinite;
            }

            .loading-circle:nth-child(2) {
                animation-delay: 0.2s;
            }

            .loading-circle:nth-child(3) {
                animation-delay: 0.4s;
            }
        `;
        document.head.appendChild(style);

        // Create 3 circles
        for (let i = 0; i < 3; i++) {
            const circle = document.createElement("div");
            circle.className = "loading-circle";
            circle.style.cssText = `
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background-color: #DBD7CA;
            `;
            container.appendChild(circle);
        }

        return container;
    }

    private addSourcesToMessage(messageWrapper: HTMLElement, sources: ChatSource[]): void {
        const sourcesContainer = document.createElement("div");
        sourcesContainer.style.cssText = `
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-top: 0.75rem;
        `;

        sources.forEach((source) => {
            const button = document.createElement("a");
            button.href = source.url;
            button.target = "_blank";
            button.style.cssText = `
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.5rem 0.75rem;
                background: #E9E7E1;
                color: #212121;
                text-decoration: none;
                font-size: 14px;
                font-weight: 500;
                border-radius: 20px;
                transition: background 0.2s;
            `;

            const text = document.createElement("span");
            text.textContent = source.title;
            button.appendChild(text);

            const icon = document.createElement("span");
            icon.innerHTML = `<svg width="9" height="9" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.75 9.75L9.75 0.75M9.75 0.75H3.13776M9.75 0.75V6.92143" stroke="black" stroke-width="1.5" stroke-linecap="round"/>
</svg>`;
            icon.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            button.appendChild(icon);

            button.addEventListener("mouseenter", () => {
                button.style.background = "#DBD7CA";
            });
            button.addEventListener("mouseleave", () => {
                button.style.background = "#E9E7E1";
            });

            sourcesContainer.appendChild(button);
        });

        messageWrapper.appendChild(sourcesContainer);
    }

    private scrollToBottom(): void {
        requestAnimationFrame(() => {
            const chatContainer = document.querySelector(".wiki-container.is-chat") as HTMLElement;
            if (chatContainer) {
                chatContainer.scrollTo({
                    top: chatContainer.scrollHeight,
                    behavior: "auto",
                });
            }
        });
    }
}

// Initialize chat
function initChat() {
    new ChatUI();
}

// Initialize when Webflow is ready
window.Webflow ||= [];
window.Webflow.push(() => {
    sidebar();
    initChat();
});
