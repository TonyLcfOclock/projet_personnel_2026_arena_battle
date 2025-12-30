<script>
    import { registerUser } from "../assets/scripts/services/auth.service.js";

    let { gameState = $bindable(), id = $bindable() } = $props();

    async function register(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const username = formData.get("username");
        const password = formData.get("password");
        const validatePassword = formData.get("validate-password");

        if (password !== validatePassword) return;

        try {
            await registerUser({ username, password });

            gameState = "login";
        } catch (error) {
            // TODO
        }
    }
</script>

<div class="register">
    <form action="POST" name="register-form" class="register-form" on:submit={register}>
        <header class="register-header">
            <h1>Register</h1>
            <p>Créer ton compte.</p>
        </header>

        <label class="register-field">
            <span>Username</span>
            <input type="text" name="username" autocomplete="username" required />
        </label>

        <label class="register-field">
            <span>Password</span>
            <input type="password" name="password" required />
        </label>

        <label class="register-field">
            <span>Validate Password</span>
            <input type="password" name="validate-password" required />
        </label>

        <button type="submit" class="register-submit">S'enregistrer</button>
    </form>
</div>

<style>
    .register {
        min-height: 80dvh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2.5rem var(--page-gutter);
    }

    .register-form {
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

    .register-header h1 {
        margin: 0;
        font-size: clamp(1.6rem, 3vw, 2.2rem);
        letter-spacing: 0.02em;
    }

    .register-header p {
        margin: 0.5rem 0 0;
        color: #B9BAB2;
        font-size: 0.95rem;
    }

    .register-field {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #C7C8C1;
    }

    .register-field input {
        background-color: #10100C;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 0.75rem;
        padding: 0.8rem 0.95rem;
        color: #F4F4EF;
        font-size: 1rem;
        outline: none;
    }

    .register-field input:focus {
        border-color: rgba(226, 34, 76, 0.6);
        box-shadow: 0 0 0 3px rgba(226, 34, 76, 0.2);
    }

    .register-submit {
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

    .register-submit:hover {
        transform: translateY(-1px);
        box-shadow: 0 16px 30px rgba(226, 34, 76, 0.32);
    }

    .register-submit:active {
        transform: translateY(0);
    }
</style>
