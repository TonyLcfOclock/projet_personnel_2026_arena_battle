<script>
    import { loginUser } from "../assets/scripts/services/auth.service.js";
    import { setAuth } from "../assets/scripts/store/auth.svelte.js";

    let { gameState = $bindable() } = $props();

    async function login(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const username = formData.get("username");
        const password = formData.get("password");

        try {
            const data = await loginUser({ username, password });

            setAuth(data);
            
            localStorage.setItem('gameState', 'home');

            gameState = localStorage.getItem('gameState');
            
        } catch (error) {
            // TODO
        }
    }
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
    </form>
</div>

<style>
    .login {
        min-height: 80dvh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2.5rem var(--page-gutter);
    }

    .login-form {
        width: min(26rem, 100%);
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
        padding: 2rem 2.25rem;
        background:
            radial-gradient(circle at top, rgba(226, 34, 76, 0.12), transparent 55%),
            #15150F;
        border-radius: 1.25rem;
        border: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: 0 18px 45px rgba(0, 0, 0, 0.4);
        color: #F4F4EF;
    }

    .login-header h1 {
        margin: 0;
        font-size: clamp(1.6rem, 3vw, 2.2rem);
        letter-spacing: 0.02em;
    }

    .login-header p {
        margin: 0.5rem 0 0;
        color: #B9BAB2;
        font-size: 0.95rem;
    }

    .login-field {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #C7C8C1;
    }

    .login-field input {
        background-color: #10100C;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 0.75rem;
        padding: 0.8rem 0.95rem;
        color: #F4F4EF;
        font-size: 1rem;
        outline: none;
    }

    .login-field input:focus {
        border-color: rgba(226, 34, 76, 0.6);
        box-shadow: 0 0 0 3px rgba(226, 34, 76, 0.2);
    }

    .login-submit {
        border: none;
        border-radius: 999px;
        padding: 0.85rem 1.2rem;
        font-weight: 600;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        cursor: pointer;
        background: linear-gradient(135deg, #E2224C, #A51E3A);
        color: #FFFFFF;
        box-shadow: 0 12px 24px rgba(226, 34, 76, 0.25);
        transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    .login-submit:hover {
        transform: translateY(-1px);
        box-shadow: 0 16px 30px rgba(226, 34, 76, 0.32);
    }

    .login-submit:active {
        transform: translateY(0);
    }
</style>
