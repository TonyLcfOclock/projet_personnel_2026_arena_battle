<script>
    import { onMount } from 'svelte';
    import Login from './components/Login.svelte';
    import Register from './components/Register.svelte';
    import Fight from './components/Fight.svelte';
    import Game from './assets/scripts/utils/Game.svelte.js';
    import CharacterSelection from './components/CharacterSelection.svelte';
    import { initAuth, logoutUser } from './assets/scripts/services/auth.service.js';
    import { authUser } from './assets/scripts/store/auth.svelte.js';

    let gameState = $state(Game.state);

    onMount(async () => {
        await initAuth();

        if (authUser.username) {
            if (authUser.currentBattle) {
                gameState = "fight";
            } else {
                gameState = "character-selection"
            }
        }
    })

    async function logout() {
        await logoutUser();

        window.location.reload();
    }
</script>

<header>
    <ul>
        {#if authUser.username}
            <li>{`Hello, ${authUser.username}`}</li>
            <li onclick={logout}>logout</li>
        {:else}
            <li onclick={() => {gameState = "register"}}>register</li>
            <li onclick={() => {gameState = "login"}}>login</li>
        {/if}
    </ul>
</header>

{#if gameState === "fight"}
    <Fight bind:gameState/>
{/if}

{#if gameState === "character-selection"}
    <CharacterSelection bind:gameState/>
{/if}

{#if gameState === "register"}
    <Register bind:gameState/>
{/if}

{#if gameState === "login"}
    <Login bind:gameState/>
{/if}

<style>
    header {
        display: flex;
        align-items: center;
        height: var(--menu-height);
        width: 100%;
        background-color: #13130B;
        color: white;
        border-top: 1px solid rgba(255, 255, 255, 0.06);
        padding: 0 var(--page-gutter);
        box-sizing: border-box;
    }

    header ul {
        list-style: none;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: var(--menu-gap);
        margin: 0;
        padding: 0;
        width: 100%;
    }

    header li {
        text-transform: uppercase;
        letter-spacing: 0.06em;
        font-size: 0.9rem;
        opacity: 0.9;
        cursor: pointer;
    }

    header li:hover {
        opacity: 1;
    }
</style>
