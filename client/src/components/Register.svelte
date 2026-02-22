<script>
    import { registerUser } from "../assets/scripts/services/auth.service.js";

    let { gameState = $bindable() } = $props();
    let registerError = $state("");

    async function register(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const username = formData.get("username");
        const password = formData.get("password");

        const validatePassword = formData.get("validate-password");

        if (password !== validatePassword) {
            return registerError = "Les deux mots de passe doivent être identique.";
        };

        const data = await registerUser({ username, password });

        e.target.reset();

        if (data.error) {
            return registerError = "Format de mot de passe invalide. Celui-ci doit inclure au moins une majuscule, une minuscule, un nombre, un caractère spécial et contenir au minimum 8 caractères.";
        };

        if (data.username) {
            localStorage.setItem('gameState', 'login');
            gameState = localStorage.getItem('gameState');
            return;
        };
    };
</script>

<div class="register">
    <form action="POST" name="register-form" class="register-form" on:submit={register}>
        <header class="register-header">
            <h1>S'enregistrer</h1>
            <p>Créez votre compte.</p>
        </header>

        <label class="register-field">
            <span>Identifiant</span>
            <input type="text" name="username" autocomplete="username" required />
        </label>

        <label class="register-field">
            <span>Mot de passe</span>
            <input type="password" name="password" required />
        </label>

        <label class="register-field">
            <span>Confirmation du mot de passe</span>
            <input type="password" name="validate-password" required />
        </label>

        <button type="submit" class="register-submit">S'enregistrer</button>

        <p class="error-notice">{registerError}</p>
    </form>
</div>

<style>
    .register {
        min-height: 85dvh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 3rem var(--page-gutter) 4rem;
        position: relative;
        isolation: isolate;
    }

    .register-form {
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

    .register-form::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, var(--color-border-accent), transparent);
    }

    .register-header h1 {
        margin: 0;
        font-family: "Pirata One", system-ui;
        font-size: clamp(2rem, 3.6vw, 2.6rem);
        letter-spacing: 0.06em;
        text-transform: uppercase;
    }

    .register-header p {
        margin: 0.5rem 0 0;
        color: var(--text-body-soft);
        font-size: 1rem;
        font-family: "Crimson Pro", serif;
        font-style: italic;
    }

    .register-field {
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: var(--text-body-soft);
    }

    .register-field input {
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

    .register-field input:focus {
        border-color: var(--color-accent-soft);
        box-shadow: var(--focus-ring);
    }

    .register-submit {
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

    .register-submit:hover {
        transform: translateY(-1px);
        filter: brightness(1.05);
        box-shadow: 0 16px 30px var(--color-overlay-medium);
    }

    .register-submit:active {
        transform: translateY(0);
    }

    .error-notice {
        margin-top: 0.7rem;
        color: var(--color-accent-strong);
        font-size: 0.9rem;
    }
</style>