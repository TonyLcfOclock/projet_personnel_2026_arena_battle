<script>
    import { onMount } from "svelte";
    import Login from "./components/Login.svelte";
    import Register from "./components/Register.svelte";
    import Fight from "./components/Fight.svelte";
    import Game from "./assets/scripts/utils/Game.svelte.js";
    import CharacterSelection from "./components/CharacterSelection.svelte";
    import {
        initAuth,
        logoutUser,
    } from "./assets/scripts/services/auth.service.js";
    import { authUser } from "./assets/scripts/store/auth.svelte.js";

    let gameState = $state(Game.state);

    onMount(async () => {
        await initAuth();
        if (authUser.username) {
            if (authUser.currentBattle) {
                gameState = "fight";
            } else {
                gameState = "character-selection";
            }
        }
    });

    async function logout() {
        await logoutUser();

        window.location.reload();
    }
</script>

<header class="site-header">
    <div class="brand">
        <img src="/images/logo.png" alt="arena-battle-logo" />
    </div>
    <nav class="main-nav">
        <ul>
            <li><button class="nav-link">Jouer</button></li>
            <li><button class="nav-link">Bestiaire</button></li>
            <li><button class="nav-link">Classement</button></li>
        </ul>
    </nav>
    <div class="header-actions">
        {#if authUser.username}
            <span class="user-chip">{`Hello, ${authUser.username}`}</span>
            <button class="text-button" onclick={logout}>Déconnexion</button>
        {:else}
            <button
                class="icon-button"
                title="S'enregistrer"
                onclick={() => {
                    gameState = "register";
                }}
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
                            d="M20 18L17 18M17 18L14 18M17 18V15M17 18V21M11 21H4C4 17.134 7.13401 14 11 14C11.695 14 12.3663 14.1013 13 14.2899M15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z"
                            stroke="#ffffff"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        ></path>
                    </g></svg
                >
            </button>
            <button
                class="icon-button"
                title="Connexion"
                onclick={() => {
                    gameState = "login";
                }}
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
                    </g></svg
                >
            </button>
        {/if}
        <button class="icon-button" title="Paramètres">
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
                        d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
                        stroke="#ffffff"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    ></path>
                    <path
                        d="M12.9046 3.06005C12.6988 3 12.4659 3 12 3C11.5341 3 11.3012 3 11.0954 3.06005C10.7942 3.14794 10.5281 3.32808 10.3346 3.57511C10.2024 3.74388 10.1159 3.96016 9.94291 4.39272C9.69419 5.01452 9.00393 5.33471 8.36857 5.123L7.79779 4.93281C7.3929 4.79785 7.19045 4.73036 6.99196 4.7188C6.70039 4.70181 6.4102 4.77032 6.15701 4.9159C5.98465 5.01501 5.83376 5.16591 5.53197 5.4677C5.21122 5.78845 5.05084 5.94882 4.94896 6.13189C4.79927 6.40084 4.73595 6.70934 4.76759 7.01551C4.78912 7.2239 4.87335 7.43449 5.04182 7.85566C5.30565 8.51523 5.05184 9.26878 4.44272 9.63433L4.16521 9.80087C3.74031 10.0558 3.52786 10.1833 3.37354 10.3588C3.23698 10.5141 3.13401 10.696 3.07109 10.893C3 11.1156 3 11.3658 3 11.8663C3 12.4589 3 12.7551 3.09462 13.0088C3.17823 13.2329 3.31422 13.4337 3.49124 13.5946C3.69158 13.7766 3.96395 13.8856 4.50866 14.1035C5.06534 14.3261 5.35196 14.9441 5.16236 15.5129L4.94721 16.1584C4.79819 16.6054 4.72367 16.829 4.7169 17.0486C4.70875 17.3127 4.77049 17.5742 4.89587 17.8067C5.00015 18.0002 5.16678 18.1668 5.5 18.5C5.83323 18.8332 5.99985 18.9998 6.19325 19.1041C6.4258 19.2295 6.68733 19.2913 6.9514 19.2831C7.17102 19.2763 7.39456 19.2018 7.84164 19.0528L8.36862 18.8771C9.00393 18.6654 9.6942 18.9855 9.94291 19.6073C10.1159 20.0398 10.2024 20.2561 10.3346 20.4249C10.5281 20.6719 10.7942 20.8521 11.0954 20.94C11.3012 21 11.5341 21 12 21C12.4659 21 12.6988 21 12.9046 20.94C13.2058 20.8521 13.4719 20.6719 13.6654 20.4249C13.7976 20.2561 13.8841 20.0398 14.0571 19.6073C14.3058 18.9855 14.9961 18.6654 15.6313 18.8773L16.1579 19.0529C16.605 19.2019 16.8286 19.2764 17.0482 19.2832C17.3123 19.2913 17.5738 19.2296 17.8063 19.1042C17.9997 18.9999 18.1664 18.8333 18.4996 18.5001C18.8328 18.1669 18.9994 18.0002 19.1037 17.8068C19.2291 17.5743 19.2908 17.3127 19.2827 17.0487C19.2759 16.8291 19.2014 16.6055 19.0524 16.1584L18.8374 15.5134C18.6477 14.9444 18.9344 14.3262 19.4913 14.1035C20.036 13.8856 20.3084 13.7766 20.5088 13.5946C20.6858 13.4337 20.8218 13.2329 20.9054 13.0088C21 12.7551 21 12.4589 21 11.8663C21 11.3658 21 11.1156 20.9289 10.893C20.866 10.696 20.763 10.5141 20.6265 10.3588C20.4721 10.1833 20.2597 10.0558 19.8348 9.80087L19.5569 9.63416C18.9478 9.26867 18.6939 8.51514 18.9578 7.85558C19.1262 7.43443 19.2105 7.22383 19.232 7.01543C19.2636 6.70926 19.2003 6.40077 19.0506 6.13181C18.9487 5.94875 18.7884 5.78837 18.4676 5.46762C18.1658 5.16584 18.0149 5.01494 17.8426 4.91583C17.5894 4.77024 17.2992 4.70174 17.0076 4.71872C16.8091 4.73029 16.6067 4.79777 16.2018 4.93273L15.6314 5.12287C14.9961 5.33464 14.3058 5.0145 14.0571 4.39272C13.8841 3.96016 13.7976 3.74388 13.6654 3.57511C13.4719 3.32808 13.2058 3.14794 12.9046 3.06005Z"
                        stroke="#ffffff"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    ></path>
                </g></svg
            >
        </button>
    </div>
</header>

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

    .user-chip {
        background: #1b1b12;
        border: 1px solid rgba(255, 255, 255, 0.08);
        color: #e7e7e2;
        padding: 0.4rem 0.9rem;
        border-radius: 999px;
        font-size: 0.85rem;
        letter-spacing: 0.05em;
        text-transform: uppercase;
    }

    .text-button {
        border: 1px solid rgba(226, 34, 76, 0.45);
        background: rgba(226, 34, 76, 0.18);
        color: #f4e9ec;
        padding: 0.45rem 0.9rem;
        border-radius: 0.75rem;
        font-size: 0.85rem;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        cursor: pointer;
        transition:
            transform 0.12s ease,
            border-color 0.12s ease,
            background 0.12s ease;
    }

    .text-button:hover {
        transform: translateY(-1px);
        border-color: rgba(226, 34, 76, 0.7);
        background: rgba(226, 34, 76, 0.28);
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
    }
</style>
