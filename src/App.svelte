<script>
    import Fight from './components/Fight.svelte';

    let gameState = $state("fight");
</script>

<header>
    <h1>Personal Project</h1>
</header>
<main>
    {#if gameState === "fight"}
        <Fight/>
    {/if}
</main>
<footer></footer>