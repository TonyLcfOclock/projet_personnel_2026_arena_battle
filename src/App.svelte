<script>
    import Fight from './components/Fight.svelte';
    import OpenWorld from './components/OpenWorld.svelte';

    let gameState = $state("fight");
</script>

<header>
    <h1>Personal Project</h1>
</header>
<main>
    {#if gameState === "fight"}
        <Fight/>
    {/if}

    {#if gameState === "open-world"}
        <OpenWorld bind:gameState/>
    {/if}
</main>
<footer></footer>