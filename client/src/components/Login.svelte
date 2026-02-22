<script>
    import { loginUser } from "../assets/scripts/services/auth.service.js";
    import { setAuth } from "../assets/scripts/store/auth.svelte.js";

    let { gameState = $bindable() } = $props();
    let loginError = $state("");

    async function login(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const username = formData.get("username");
        const password = formData.get("password");

        const data = await loginUser({ username, password });

        setAuth(data);

        e.target.reset();
            
        if (data.username) {
            localStorage.setItem('gameState', 'home');
            gameState = localStorage.getItem('gameState');
            return;
        };

        loginError = "Identifiant ou mot de passe incorrect.";
    };
</script>

<div class="login">
    <form action="POST" name="login-form" class="login-form" on:submit={login}>
        <header class="login-header">
            <h1>Se connecter</h1>
            <p>Connectez-vous pour continuer l'aventure.</p>
        </header>

        <label class="login-field">
            <span>Identifiant</span>
            <input type="text" name="username" autocomplete="username" required />
        </label>

        <label class="login-field">
            <span>Mot de passe</span>
            <input type="password" name="password" autocomplete="current-password" required />
        </label>

        <button type="submit" class="login-submit">Se connecter</button>

        <p class="error-notice">{loginError}</p>
    </form>
</div>

<style>
    .login {
        min-height: 85dvh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 3rem var(--page-gutter) 4rem;
        position: relative;
        isolation: isolate;
    }

    .login-form {
        width: min(28rem, 100%);
        display: flex;
        flex-direction: column;
        gap: 1.35rem;
        padding: 2.6rem 2.6rem 2.4rem;
        background: var(--color-surface-base);
        border-radius: var(--radius-md);
        border: 1px solid var(--color-border-accent);
        box-shadow: 0 24px 50px var(--shadow-panel-color), inset 0 0 0 1px var(--color-white-soft);
        color: var(--text-primary);
        position: relative;
        overflow: hidden;
    }

    .login-form::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, var(--color-border-accent), transparent);
    }

    .login-header h1 {
        margin: 0;
        font-family: "Pirata One", system-ui;
        font-size: clamp(2rem, 3.6vw, 2.6rem);
        letter-spacing: 0.06em;
        text-transform: uppercase;
    }

    .login-header p {
        margin: 0.5rem 0 0;
        color: var(--text-body-soft);
        font-size: 1rem;
        font-family: "Crimson Pro", serif;
        font-style: italic;
    }

    .login-field {
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: var(--text-body-soft);
    }

    .login-field input {
        background-color: var(--color-surface-soft);
        border: 1px solid var(--color-border-base);
        border-radius: var(--radius-md);
        padding: 0.85rem 1rem;
        color: var(--text-primary);
        font-size: 1rem;
        outline: none;
        box-shadow: inset 0 0 0 var(--color-transparent);
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .login-field input:focus {
        border-color: var(--color-accent-soft);
        box-shadow: var(--focus-ring);
    }

    .login-submit {
        border: 1px solid var(--color-border-accent);
        border-radius: var(--radius-pill);
        padding: 0.95rem 1.5rem;
        font-weight: var(--font-weight-semibold);
        letter-spacing: 0.08em;
        text-transform: uppercase;
        cursor: pointer;
        background: linear-gradient(135deg, var(--blood-red-dark), var(--blood-red), var(--blood-red-dark));
        color: var(--text-primary);
        box-shadow: 0 12px 24px var(--shadow-soft-color);
        transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
    }

    .login-submit:hover {
        transform: translateY(-1px);
        filter: brightness(1.05);
        box-shadow: 0 16px 30px var(--color-overlay-medium);
    }

    .login-submit:active {
        transform: translateY(0);
    }

    .error-notice {
        margin-top: 0.7rem;
        color: var(--color-accent-strong);
        font-size: 0.9rem;
    }
</style>