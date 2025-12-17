<script>
    import Fight from './components/Fight.svelte';
    import OpenWorld from './components/OpenWorld.svelte';
    import Game from './assets/scripts/utils/Game.svelte';
    import CharacterSelection from './components/CharacterSelection.svelte';
    let gameState = $state(Game.state);
    let id = $state(undefined);
</script>


{#if gameState === "fight"}
    <Fight bind:id bind:gameState/>
{/if}

{#if gameState === "character-selection"}
    <CharacterSelection bind:id bind:gameState/>
{/if}

<!-- {#if gameState === "open-world"}
    <OpenWorld bind:gameState/>
{/if} -->