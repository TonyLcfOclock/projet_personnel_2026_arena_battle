<script>
    let { gameState = $bindable() } = $props();

    let inbox = $state([]);

    let selectedMessageId = $state(1);
    let compose = $state({
        to: "",
        subject: "",
        body: "",
    });
    
    let composerNotice = $state("");

    let selectedMessage = $derived(inbox.find((message) => message.id === selectedMessageId));
    let unreadCount = $derived(inbox.filter((message) => message.unread).length);

    function selectMessage(messageId) {
        selectedMessageId = messageId;
        inbox = inbox.map((message) =>
            message.id === messageId ? { ...message, unread: false } : message,
        );
    }

    function sendMessage(event) {
        event.preventDefault();

        if (!compose.to.trim() || !compose.subject.trim() || !compose.body.trim()) {
            composerNotice = "Tous les champs sont requis.";
            return;
        }

        composerNotice = `Message envoyé à ${compose.to.trim()}.`;
        compose = { to: "", subject: "", body: "" };
    }
</script>

<section class="messages-page">
    <header class="messages-header">
        <p class="messages-kicker">Centre de messagerie</p>
        <h1>Messages</h1>
        <p class="messages-subtitle">
            Consultez vos messages reçus et rédigez un nouveau message.
        </p>
    </header>

    <div class="messages-layout">
        <aside class="messages-inbox">
            <div class="messages-inbox-head">
                <h2>Boîte de réception</h2>
                <span>{unreadCount} non lus</span>
            </div>

            <div class="messages-list">
                {#each inbox as message}
                    <button
                        class="message-item"
                        class:is-active={selectedMessageId === message.id}
                        onclick={() => selectMessage(message.id)}
                    >
                        <div class="message-item-head">
                            <strong>{message.from}</strong>
                            <small>{message.receivedAt}</small>
                        </div>
                        <p class="message-item-subject">{message.subject}</p>
                        <p class="message-item-preview">{message.preview}</p>
                    </button>
                {/each}
            </div>
        </aside>

        <section class="messages-reader">
            {#if selectedMessage}
                <div class="reader-head">
                    <p class="reader-from">De: {selectedMessage.from}</p>
                    <p class="reader-date">{selectedMessage.receivedAt}</p>
                </div>
                <h3>{selectedMessage.subject}</h3>
                <pre>{selectedMessage.body}</pre>
            {:else}
                <p class="reader-empty">Sélectionnez un message.</p>
            {/if}
        </section>

        <section class="messages-compose">
            <h2>Rédiger un message</h2>
            <form onsubmit={sendMessage}>
                <label>
                    Destinataire
                    <input bind:value={compose.to} type="text" placeholder="Pseudo du joueur" />
                </label>
                <label>
                    Sujet
                    <input bind:value={compose.subject} type="text" placeholder="Objet du message" />
                </label>
                <label>
                    Message
                    <textarea bind:value={compose.body} rows="8" placeholder="Écrivez votre message..."></textarea>
                </label>
                <button type="submit">Envoyer</button>
            </form>
            {#if composerNotice}
                <p class="composer-notice">{composerNotice}</p>
            {/if}
        </section>
    </div>
</section>

<style>
    .messages-page {
        max-width: 1600px;
        margin: 0 auto;
        padding: 6.2rem var(--page-gutter) 4rem;
        color: var(--color-white);
        font-family: "Crimson Pro", "Times New Roman", serif;
        position: relative;
        isolation: isolate;
    }

    .messages-header {
        margin-bottom: 1rem;
    }

    .messages-kicker {
        margin: 0 0 0.45rem;
        color: var(--color-accent-strong);
        text-transform: uppercase;
        letter-spacing: 0.2em;
        font-size: 0.64rem;
        font-family: "Inter", "Segoe UI", sans-serif;
    }

    .messages-header h1 {
        margin: 0;
        font-family: "Pirata One", system-ui;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-size: clamp(2rem, 4vw, 3.4rem);
        color: var(--text-primary);
    }

    .messages-subtitle {
        margin-top: 0.6rem;
        max-width: 52rem;
        color: var(--text-body-soft);
        line-height: 1.45;
    }

    .messages-layout {
        display: grid;
        grid-template-columns: 22rem minmax(0, calc(100% - 22rem - 23rem - 2rem)) 23rem;
        gap: 1rem;
        align-items: stretch;
    }

    .messages-reader {
        background: var(--color-surface-base);
        border: 1px solid var(--color-border-accent);
        box-shadow: 0 10px 22px var(--color-overlay-soft), inset 0 0 0 1px var(--color-white-soft);
        padding: 0.9rem;
        width: 50rem;
        overflow-x: hidden;
    }

    .messages-inbox,
    .messages-compose {
        background: var(--color-surface-base);
        border: 1px solid var(--color-border-accent);
        box-shadow: 0 10px 22px var(--color-overlay-soft), inset 0 0 0 1px var(--color-white-soft);
        padding: 0.9rem;
        min-width: 0;
        width: 100%;
        max-width: 100%;
        overflow-x: hidden;
    }

    .messages-inbox {
        display: flex;
        flex-direction: column;
        min-height: 0;
    }

    .messages-inbox-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;
        padding-bottom: 0.45rem;
        border-bottom: 1px solid var(--ui-border);
    }

    .messages-inbox-head h2,
    .messages-compose h2,
    .messages-reader h3 {
        margin: 0;
        font-family: "Pirata One", system-ui;
        letter-spacing: 0.06em;
        color: var(--text-primary);
        text-transform: uppercase;
    }

    .messages-inbox-head span {
        color: var(--color-accent-strong);
        font-size: 0.7rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        font-family: "Inter", "Segoe UI", sans-serif;
    }

    .messages-list {
        display: flex;
        flex-direction: column;
        gap: 0.55rem;
        overflow: visible;
    }

    .message-item {
        border: 1px solid var(--ui-border);
        background: var(--color-surface-base);
        color: inherit;
        text-align: left;
        padding: 0.65rem;
        cursor: pointer;
        min-width: 0;
        transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
    }

    .message-item.is-active {
        border-color: var(--color-border-accent);
        background: var(--color-surface-soft);
    }

    .message-item:hover {
        border-color: var(--color-border-accent);
        background: var(--color-surface-soft);
        transform: translateY(-1px);
    }

    .message-item-head {
        display: flex;
        justify-content: space-between;
        gap: 0.5rem;
        min-width: 0;
    }

    .message-item-head strong {
        color: var(--text-primary);
        font-family: "Pirata One", system-ui;
        font-size: 1rem;
        letter-spacing: 0.04em;
        overflow-wrap: anywhere;
        word-break: break-word;
        min-width: 0;
    }

    .message-item-head small {
        color: var(--text-muted);
        font-size: 0.6rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        font-family: "Inter", "Segoe UI", sans-serif;
        min-width: 0;
    }

    .message-item-subject {
        margin: 0.35rem 0 0.2rem;
        color: var(--color-accent-strong);
        overflow-wrap: anywhere;
        word-break: break-word;
    }

    .message-item-preview {
        margin: 0;
        color: var(--color-text-body);
        font-size: 0.92rem;
        overflow-wrap: anywhere;
        word-break: break-word;
    }

    .reader-head {
        display: flex;
        justify-content: space-between;
        gap: 0.8rem;
        padding-bottom: 0.55rem;
        border-bottom: 1px solid var(--ui-border);
    }

    .reader-from,
    .reader-date {
        margin: 0;
        font-size: 0.72rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-family: "Inter", "Segoe UI", sans-serif;
    }

    .reader-from {
        color: var(--color-accent-strong);
    }

    .reader-date {
        color: var(--text-muted);
    }

    .messages-reader h3 {
        margin: 0.8rem 0 0.6rem;
        font-size: 1.35rem;
    }

    .messages-reader pre {
        margin: 0;
        white-space: pre-wrap;
        line-height: 1.45;
        color: var(--color-white);
        font-family: "Crimson Pro", "Times New Roman", serif;
        overflow-wrap: anywhere;
        word-break: break-word;
        overflow: hidden;
        max-width: 100%;
    }

    .reader-empty {
        margin: 0;
        color: var(--text-muted);
    }

    .messages-compose h2 {
        margin-bottom: 0.75rem;
    }

    .messages-compose form {
        display: flex;
        flex-direction: column;
        gap: 0.62rem;
    }

    .messages-compose label {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        color: var(--color-accent-strong);
        font-family: "Inter", "Segoe UI", sans-serif;
        font-size: 0.66rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
    }

    .messages-compose input,
    .messages-compose textarea {
        border: 1px solid var(--ui-border);
        background: var(--color-surface-base);
        color: var(--text-primary);
        padding: 0.55rem 0.62rem;
        font-family: "Inter", "Segoe UI", sans-serif;
        font-size: 0.85rem;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .messages-compose input:focus,
    .messages-compose textarea:focus {
        border-color: var(--color-border-accent);
        box-shadow: var(--focus-ring);
        outline: none;
    }

    .messages-compose textarea {
        resize: vertical;
        min-height: 9rem;
    }

    .messages-compose button {
        border: 1px solid var(--color-border-accent);
        background: var(--color-surface-base);
        color: var(--text-primary);
        padding: 0.55rem 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-family: "Pirata One", system-ui;
        cursor: pointer;
    }

    .messages-compose button:hover {
        border-color: var(--color-accent-soft);
        color: var(--color-accent-strong);
    }

    .composer-notice {
        margin-top: 0.7rem;
        color: var(--color-accent-strong);
        font-size: 0.9rem;
    }

    @media (max-width: 1200px) {
        .messages-layout {
            grid-template-columns: 1fr;
        }

        .messages-inbox,
        .messages-reader,
        .messages-compose {
            width: 100%;
        }
    }

    @media (max-width: 700px) {
        .messages-page {
            padding-top: 6.1rem;
        }
    }
</style>