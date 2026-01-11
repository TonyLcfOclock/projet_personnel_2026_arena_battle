<script>
    import { onDestroy, onMount } from "svelte";
    import Login from "./components/Login.svelte";
    import Register from "./components/Register.svelte";
    import Fight from "./components/Fight.svelte";
    import Game from "./assets/scripts/utils/Game.svelte.js";
    import CharacterSelection from "./components/CharacterSelection.svelte";
    import { initAuth, logoutUser } from "./assets/scripts/services/auth.service.js";
    import { authUser } from "./assets/scripts/store/auth.svelte.js";

    let gameState = $state(Game.state);
    let profileMenuOpen = $state(false);

    onMount(async () => {
        document.addEventListener("click", handleDocumentClick);

        await initAuth();
        if (authUser.username) {
            if (authUser.currentBattle) {
                gameState = "fight";
            } else {
                gameState = "character-selection";
            }
        }
    });

    onDestroy(() => {
        document.removeEventListener("click", handleDocumentClick);
    });

    function toggleProfileMenu(event) {
        event.stopPropagation();
        profileMenuOpen = !profileMenuOpen;
    }

    function closeProfileMenu() {
        profileMenuOpen = false;
    }

    function handleDocumentClick() {
        if (profileMenuOpen) {
            profileMenuOpen = false;
        }
    }

    function handlePlayingClick() {
        if (authUser.username && authUser.currentBattle) {
            gameState = 'fight';
        } else if(authUser.username && !authUser.currentBattle) {
            gameState = 'character-selection';
        } else {
            gameState = 'register';
        }
    }

    async function logout() {
        await logoutUser();

        window.location.reload();
    }
</script>

<header class="site-header">
    <div class="brand" style="cursor: pointer;" onclick={gameState = ''}>
        <img src="/images/logo.png" alt="arena-battle-logo" />
    </div>
    <nav class="main-nav">
        <ul>
            <li><button class="nav-link" onclick={handlePlayingClick}>Jouer</button></li>
            <li><button class="nav-link">Bestiaire</button></li>
            <li><button class="nav-link">Classement</button></li>
        </ul>
    </nav>
    <div class="header-actions">
        <div class="profile-menu" onclick={(event) => event.stopPropagation()}>
            <button
                class="icon-button"
                title="Profil"
                onclick={toggleProfileMenu}
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="#ffffff"
                    ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    ></g><g id="SVGRepo_iconCarrier">
                        <path
                            d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                            stroke="#ffffff"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        ></path>
                        <path
                            d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                            stroke="#ffffff"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        ></path>
                    </g>
                </svg>
            </button>
            {#if profileMenuOpen}
                <div class="profile-dropdown" role="menu">
                    {#if authUser.username}
                        <p class="profile-name">{authUser.username}</p>
                        <button
                            class="menu-item"
                            role="menuitem"
                            onclick={closeProfileMenu}
                        >
                            Profil
                        </button>
                        <button
                            class="menu-item"
                            role="menuitem"
                            onclick={closeProfileMenu}
                        >
                            Paramètres
                        </button>
                        <button
                            class="menu-item danger"
                            role="menuitem"
                            onclick={logout}
                        >
                            Déconnexion
                        </button>
                    {:else}
                        <button
                            class="menu-item"
                            role="menuitem"
                            onclick={() => {
                                closeProfileMenu();
                                gameState = "login";
                            }}
                        >
                            Se connecter
                        </button>
                        <button
                            class="menu-item"
                            role="menuitem"
                            onclick={() => {
                                closeProfileMenu();
                                gameState = "register";
                            }}
                        >
                            S'enregistrer
                        </button>
                    {/if}
                </div>
            {/if}
        </div>
    </div>
</header>
{#if gameState === ""}
    <section class="home">
        <div class="hero">
            <div class="hero-text">
                <p class="hero-eyebrow">Arena Battle</p>
                <h1>Des duels tactiques au tour par tour.</h1>
                <p class="hero-subtitle">
                    Choisissez un champion, affrontez en un autre, et adaptez votre
                    stratégie à chaque tour
                </p>
            </div>
            <div class="hero-visual">
                <img src="/images/characters.png" alt="Champions Arena Battle" />
            </div>
        </div>
        <div class="feature-grid">
            <article class="feature-card">
                <h2>Choisissez votre personnage</h2>
                <p>
                    Chaque combattant a ses statistiques, ses competences et
                    ses effets (buffs/debuffs).
                </p>
            </article>
            <article class="feature-card">
                <h2>Combattez tour par tour</h2>
                <p>
                    Attaque, défense, compétences : chaque decision compte.
                </p>
            </article>
            <article class="feature-card">
                <h2>Analysez et progressez</h2>
                <p>
                    Consultez le journal de combat et améliorez votre maîtrise.
                </p>
            </article>
        </div>
    </section>
{/if}


{#if gameState === "fight"}
    <Fight bind:gameState />
{/if}

{#if gameState === "character-selection"}
    <CharacterSelection bind:gameState />
{/if}

{#if gameState === "register"}
    <Register bind:gameState />
{/if}

{#if gameState === "login"}
    <Login bind:gameState />
{/if}

{#if gameState === "login" || gameState === "register" || gameState === ""}
    <footer>
        <section class="copyright">
            <p>© 2026 Arena Battle</p>
            <button class="code" onclick={ window.open('https://github.com/TonyLcfOclock/projet_personnel_2026_arena_battle', '_blank') }>
                <span><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0h24v24H0z" fill="none"></path>
                    <path
                        d="M24 12l-5.657 5.657-1.414-1.414L21.172 12l-4.243-4.243 1.414-1.414L24 12zM2.828 12l4.243 4.243-1.414 1.414L0 12l5.657-5.657L7.07 7.757 2.828 12zm6.96 9H7.66l6.552-18h2.128L9.788 21z"
                        fill="currentColor"
                    ></path>
                    </svg>
                    Code
                </span>
            </button>
        </section>
    </footer>
{/if}

<style>
    .site-header {
        display: flex;
        align-items: center;
        gap: clamp(0.75rem, 2vw, 1.5rem);
        height: 5.5rem;
        width: 100%;
        background: linear-gradient(
            180deg,
            rgba(25, 20, 16, 0.98),
            rgba(16, 16, 12, 0.98)
        );
        color: white;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        box-shadow: 0 14px 30px rgba(0, 0, 0, 0.35);
        padding: 0 var(--page-gutter);
        box-sizing: border-box;
    }

    .brand img {
        margin-left: 3rem;
        height: 8rem;
        width: 8rem;
        filter: drop-shadow(0 6px 14px rgba(0, 0, 0, 0.35));
    }

    .main-nav {
        flex: 1;
        display: flex;
        justify-content: center;
    }

    .main-nav ul {
        list-style: none;
        display: flex;
        align-items: center;
        gap: clamp(0.75rem, 2vw, 1.5rem);
        margin: 0;
        padding: 0;
    }

    .nav-link {
        border: 1px solid transparent;
        background: transparent;
        color: #f1eae4;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: 0.9rem;
        font-weight: 600;
        padding: 0.5rem 0.95rem;
        border-radius: 999px;
        cursor: pointer;
        transition:
            border-color 0.15s ease,
            background 0.15s ease,
            color 0.15s ease;
    }

    .nav-link:hover {
        background: rgba(226, 34, 76, 0.15);
        border-color: rgba(226, 34, 76, 0.35);
        color: #ffffff;
    }

    .header-actions {
        display: flex;
        align-items: center;
        gap: 0.6rem;
    }

    .icon-button {
        width: 2.6rem;
        height: 2.6rem;
        border-radius: 0.8rem;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: #1b1b12;
        color: #f4e9ec;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.35);
        transition:
            transform 0.12s ease,
            border-color 0.12s ease,
            background 0.12s ease;
    }

    .icon-button:hover {
        transform: translateY(-1px);
        border-color: rgba(226, 34, 76, 0.45);
        background: rgba(226, 34, 76, 0.18);
    }

    .icon-button svg {
        width: 1.3rem;
        height: 1.3rem;
    }

    .profile-menu {
        position: relative;
    }

    .profile-dropdown {
        position: absolute;
        top: calc(100% + 0.6rem);
        right: 0;
        min-width: 12rem;
        background: #10100c;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 0.75rem;
        padding: 0.65rem;
        box-shadow: 0 18px 36px rgba(0, 0, 0, 0.45);
        z-index: 20;
    }

    .profile-name {
        margin: 0 0 0.5rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        font-size: 0.85rem;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: #e7e7e2;
    }

    .menu-item {
        width: 100%;
        border: 1px solid transparent;
        background: transparent;
        color: #f1eae4;
        text-align: left;
        font-size: 0.9rem;
        padding: 0.45rem 0.5rem;
        border-radius: 0.5rem;
        cursor: pointer;
        transition:
            background 0.12s ease,
            border-color 0.12s ease;
    }

    .menu-item:hover {
        background: rgba(226, 34, 76, 0.15);
        border-color: rgba(226, 34, 76, 0.35);
    }

    .menu-item.danger {
        color: #f5b2bf;
    }

    .home {
        max-width: 92rem;
        margin: 0 auto;
        padding: clamp(3rem, 6vw, 5.5rem) var(--page-gutter) 5rem;
        display: flex;
        flex-direction: column;
        gap: clamp(2.5rem, 4vw, 3.5rem);
    }

    .hero {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: clamp(2rem, 4vw, 3.75rem);
        align-items: center;
        background: linear-gradient(
            135deg,
            rgba(18, 16, 12, 0.95),
            rgba(34, 16, 18, 0.9)
        );
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 1.5rem;
        margin-top: 2rem;
        padding: clamp(2.25rem, 4.8vw, 3.6rem);
        box-shadow: 0 24px 50px rgba(0, 0, 0, 0.35);
        overflow: hidden;
        position: relative;
    }

    .hero::after {
        content: "";
        position: absolute;
        inset: auto -20% 10% auto;
        width: 18rem;
        height: 18rem;
        background: radial-gradient(
            circle,
            rgba(226, 34, 76, 0.25),
            rgba(226, 34, 76, 0)
        );
        pointer-events: none;
    }

    .hero-eyebrow {
        color: rgba(241, 234, 228, 0.75);
        text-transform: uppercase;
        letter-spacing: 0.2em;
        font-size: 0.75rem;
        margin-bottom: 0.75rem;
    }

    .hero h1 {
        font-size: clamp(2rem, 3.6vw, 3.4rem);
        line-height: 1.1;
        margin: 0 0 1rem;
        color: #ffffff;
    }

    .hero-subtitle {
        color: rgba(241, 234, 228, 0.85);
        font-size: 1rem;
        max-width: 30rem;
        line-height: 1.6;
    }

    .hero-visual {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .hero-visual img {
        max-width: min(100%, 34rem);
        width: 100%;
        border-radius: clamp(1rem, 2vw, 1.8rem);
        border: 1px solid rgba(255, 255, 255, 0.08);
        filter: drop-shadow(0 18px 38px rgba(0, 0, 0, 0.55));
    }

    .feature-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
        gap: 1.5rem;
        margin-top: 2rem;
    }

    .feature-card {
        background: #10100c;
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 1rem;
        padding: 1.4rem 1.5rem;
        box-shadow: 0 12px 28px rgba(0, 0, 0, 0.28);
        position: relative;
        overflow: hidden;
    }

    .feature-card::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 3.2rem;
        height: 3px;
        background: rgba(226, 34, 76, 0.65);
    }

    .feature-card h2 {
        color: #ffffff;
        font-size: 1.1rem;
        margin: 0 0 0.6rem;
        letter-spacing: 0.02em;
    }

    .feature-card p {
        color: rgba(231, 231, 226, 0.82);
        margin: 0;
        line-height: 1.6;
        font-size: 0.95rem;
    }

    footer {
        position: fixed;
        display: flex;
        align-items: center;
        justify-content: end;
        height: var(--menu-height);
        width: 100%;
        bottom: 0;
        background: linear-gradient(
            180deg,
            rgba(19, 19, 11, 0.95),
            rgba(12, 12, 9, 0.98)
        );
        color: white;
        border-top: 1px solid rgba(255, 255, 255, 0.06);
        padding: 0 var(--page-gutter);
        box-shadow: 0 -16px 32px rgba(0, 0, 0, 0.35);
    }

    .copyright {
        max-width: 92rem;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: end;
        gap: 1rem;
    }

    .copyright p {
        margin: 0;
        color: rgba(231, 231, 226, 0.75);
        letter-spacing: 0.08em;
        text-transform: uppercase;
        font-size: 0.8rem;
    }

    .code {
        position: relative;
        font-family: inherit;
        font-weight: 500;
        font-size: 0.95rem;
        letter-spacing: 0.05em;
        border-radius: 0.8em;
        cursor: pointer;
        border: 1px solid rgba(226, 34, 76, 0.45);
        background: linear-gradient(135deg, #e2224c, #86162e);
        color: ghostwhite;
        overflow: hidden;
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.35);
        transition: border-color 0.2s ease, transform 0.2s ease;
    }

    .code svg {
        width: 1.2em;
        height: 1.2em;
        margin-right: 0.5em;
    }

    .code span {
        position: relative;
        z-index: 10;
        transition: color 0.4s;
        display: inline-flex;
        align-items: center;
        padding: 0.65em 1.15em 0.65em 1em;
    }

    .code::before,
    .code::after {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
    }

    .code::before {
        content: "";
        background: #1b0d12;
        width: 120%;
        left: -10%;
        transform: skew(30deg);
        transition: transform 0.4s cubic-bezier(0.3, 1, 0.8, 1);
    }

    .code:hover::before {
        transform: translate3d(100%, 0, 0);
    }

    .code:hover {
        border-color: rgba(226, 34, 76, 0.75);
        transform: translateY(-1px);
    }

    .code:active {
        transform: scale(0.95);
    }

    @media (max-width: 900px) {
        .site-header {
            flex-wrap: wrap;
            height: auto;
            padding: 0.75rem var(--page-gutter);
        }

        .main-nav {
            order: 3;
            width: 100%;
            justify-content: flex-start;
        }

        .main-nav ul {
            flex-wrap: wrap;
        }

        .hero {
            grid-template-columns: 1fr;
        }

        .hero-visual img {
            max-width: 22rem;
        }
    }

</style>
