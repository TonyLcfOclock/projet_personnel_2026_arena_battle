<script>
    import { onMount } from "svelte";
    import Utilities from "../assets/scripts/utils/Utilities.svelte.js";

    let charImg;
    let charHalfW = $state(undefined);
    let charHalfH = $state(undefined);

    let enemyImg;
    let enemyHalfW = $state(undefined);
    let enemyHalfH = $state(undefined);

    let characters = $state(undefined);
    let selected = $state(undefined);
    let player = $state(undefined);

    onMount(async () => {
        characters = await Utilities.initiateCharacters();
    }); 

    function selectPlayerCharacter(character) {
        selected = (selected === character.className) ? undefined : character.className;

        player = character;
    }
</script>

<main class="character-selection">
    <header class="page-header">
        <h1>SÉLECTIONNEZ UN PERSONNAGE</h1>
        <p>
            Choisissez un personnage et son adversaire pour les faire s'affronter
            dans un duel en 1 contre 1.
        </p>
    </header>

    <form class="selection-form" method="POST">
        <section class="characters-infos" aria-label="Aperçu des combattants">
            <div class="panel">
                <div class="panel-header">
                    <p>Joueur</p>
                    <p class="muted">Aperçu</p>
                </div>

                <div class="character-card">
                    <div class="character-image" aria-hidden="true">
                        <img bind:this={charImg} on:load={() => { charHalfW = charImg.naturalWidth / 2; charHalfH = charImg.naturalHeight / 2; }} style={`width: ${charHalfW ? `${charHalfW}px` : 'auto'}; ${charHalfH ? `${charHalfH}px` : 'auto'}`} src="./src/assets/art/characters/humans/classes/death_knight/death_knight1.png" alt="">
                    </div>

                    <div class="character-infos-area">
                        <label for="player-name">Nom du personnage</label>
                        <input
                            type="text"
                            name="player-name"
                            id="player-name"
                            placeholder="Entrez le nom de votre personnage..."
                            required
                        />

                        <h2>{player ? player.className : ""}</h2>
                        <p class="description">
                            {player ? player.description : ""}
                        </p>

                        <div class="statistics" aria-label="Statistiques du joueur">
                            <p><span>HP</span> {player ? player.statistics.HP : "0"}</p>
                            <p><span>STR</span> {player ? player.statistics.STR : "0"}</p>
                            <p><span>ARM</span> {player ? player.statistics.ARM : "0"}</p>
                            <p><span>SPEED</span> {player ? player.statistics.speed : "0"}</p>
                            <p><span>CRIT %</span> {player ? player.statistics.CritChance : "0"}</p>
                            <p><span>CRIT DMG%</span> {player ? player.statistics.CritDamage : "0"}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="panel">
                <div class="panel-header">
                    <p>Adversaire</p>
                    <p class="muted">Aperçu</p>
                </div>

                <div class="character-card">
                    <div class="character-image" aria-hidden="true">
                        <img bind:this={enemyImg} on:load={() => { enemyHalfW = enemyImg.naturalWidth / 2; enemyHalfH = enemyImg.naturalHeight / 2; }} style={`transform: scaleX(-1); width: ${enemyHalfW ? `${enemyHalfW}px` : 'auto'}; ${enemyHalfH ? `${enemyHalfH}px` : 'auto'}`} src="./src/assets/art/characters/monsters/boss/baron.png" alt="">
                    </div>

                    <div class="character-infos-area">
 
                        <label for="enemy-name">Nom de l'adversaire</label>
                        <input
                            type="text"
                            name="enemy-name"
                            id="enemy-name"
                            value="Enemy Name"
                            readonly
                        />
                      <h2>Class Name</h2>
                        <p class="description">
                            Grosse description du personnage et de sa manière d'être jouée.
                        </p>

                        <div class="statistics" aria-label="Statistiques de l'adversaire">
                            <p><span>HP</span> 999</p>
                            <p><span>STR</span> 999</p>
                            <p><span>ARM</span> 999</p>
                            <p><span>SPEED</span> 999</p>
                            <p><span>CRIT %</span> 999</p>
                            <p><span>CRIT DMG%</span> 999</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="lists" aria-label="Sélection des personnages">
            <div class="list-panel">
                <div class="title">
                    <p>Sélection du joueur</p>
                </div>
                <div class="list-body player-selection">
                    {#each characters as character}
                        <div class="character" class:character-active={selected === character.className} id="player-{character.className}" on:click={() => selectPlayerCharacter(character)}>
                            <img style="width: 5rem; height: 5rem;" src="{character.avatar}" alt="">
                        </div>
                    {/each}
                </div>
            </div>

            <div class="list-panel">
                <div class="title">
                    <p>Sélection de l'adversaire</p>
                </div>
                  <div class="list-body enemy-selection">
                    {#each characters as character}
                        <div class="character">
                            <img style="width: 5rem; height: 5rem;" src="{character.avatar}" alt="">
                        </div>
                    {/each}
                  </div>
          </div>
        </section>

        <footer class="selection-menu" aria-label="Lancer le combat">
            <button class="start" type="submit">COMMENCER LE COMBAT</button>
        </footer>
    </form>
</main>

<style>
    .character-selection {
        min-height: 100dvh;
        padding: 2.5rem 3rem 9rem;
        color: white;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .page-header {
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        max-width: 68rem;
        margin: 0 auto;
    }

    .page-header h1 {
        letter-spacing: 0.03em;
    }

    .page-header p {
        color: #a5a8a9;
    }

    .selection-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .characters-infos {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
          align-items: stretch;
        max-width: 86rem;
        margin: 0 auto;
        width: 100%;
    }

    .panel {
        background-color: #252525;
        border-radius: 1rem;
        padding: 0.75rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
        border: 1px solid rgba(255, 255, 255, 0.04);
        display: flex;
        flex-direction: column;
        min-height: 22rem;
        height: 100%;
    }

    .panel-header {
        display: flex;
        justify-content: space-between;
        margin: 0.25rem 0.5rem 0.75rem;
        font-size: 1.05rem;
    }

    .muted {
        color: #a5a8a9;
    }

    .character-card {
        display: grid;
        grid-template-columns: 15rem 1fr;
        gap: 1rem;
        align-items: center;
        flex: 1 1 auto;
        height: 100%;
    }

    .character-image {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 15rem;
        width: 15rem;
        border-radius: 1rem;
        background:
            radial-gradient(
                circle at 30% 20%,
                rgba(255, 255, 255, 0.18),
                rgba(255, 255, 255, 0) 60%
            ),
            linear-gradient(
                180deg,
                rgba(226, 34, 76, 0.25),
                rgba(16, 16, 12, 0.2)
            );
        border: 1px solid rgba(255, 255, 255, 0.06);
    }

    .character-infos-area {
        padding: 0.9rem 1rem;
        border-radius: 1rem;
        background-color: #1b1b12;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.6rem;
        min-width: 0;
        flex: 1 1 auto;
        height: 100%;
    }

    label {
        color: #a5a8a9;
        font-size: 0.9rem;
    }

    input {
        width: 100%;
        background-color: #10100c;
        border: 1px solid #1c1c17;
        color: white;
        border-radius: 0.75rem;
        padding: 0.6rem 0.75rem;
        outline: none;
    }

    input[readonly] {
        color: #d0d2d3;
        background-color: #141410;
        cursor: default;
    }

    input:focus {
        border-color: rgba(226, 34, 76, 0.7);
        box-shadow: 0 0 0 3px rgba(226, 34, 76, 0.15);
    }

    h2 {
        font-size: 1.05rem;
        font-weight: 650;
    }

    .description {
        color: #d0d2d3;
        font-size: 0.95rem;
        line-height: 1.35;
        flex: 0 0 auto;
    }

    .statistics {
        margin-top: auto;
        width: 100%;
    }

    .lists {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        max-width: 86rem;
        margin: 0 auto;
        width: 100%;
    }

    .list-panel {
        height: 22rem;
        background-color: #10100c;
        border: 1px solid #10100c;
        border-radius: 1rem;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .list-body {
        padding: 1rem;
        overflow: auto;
        flex: 1 1 auto;
    }

    .locked-text {
        color: #a5a8a9;
        font-size: 0.95rem;
        line-height: 1.35;
        margin-bottom: 0.75rem;
    }

    .player-selection, .enemy-selection {
        display: flex;
        gap: 1rem;
        overflow: auto;
    }

    .character {
        height: 5.1rem;
        width: 5.1rem;
        border: 1px solid #a5a8a9;
    }

    .character-active {
        border: 1px solid #dd4d4d !important;
    }

    .list-panel .title {
        height: auto;
        padding: 1rem 1rem;
        border-radius: 1rem 1rem 0 0;
        flex: 0 0 auto;
    }

    .selection-menu {
        position: fixed;
        left: 0;
        bottom: 0;
        right: 0;
        height: 6rem;
        width: 100%;
        background-color: #13130b;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 1.5rem;
    }

    .start {
        width: min(38rem, 100%);
        height: 3.25rem;
        border-radius: 1rem;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: linear-gradient(
            180deg,
            rgba(226, 34, 76, 0.95),
            rgba(184, 20, 56, 0.95)
        );
        color: white;
        font-weight: 750;
        letter-spacing: 0.06em;
        cursor: pointer;
    }

    .start:hover {
        filter: brightness(1.06);
    }

    .start:active {
        transform: translateY(1px);
    }

    @media (max-width: 1100px) {
        .character-selection {
            padding: 2rem 1.25rem 9rem;
        }

        .characters-infos,
        .lists {
            grid-template-columns: 1fr;
        }

        .character-card {
            grid-template-columns: 1fr;
        }

        .character-image {
            width: 100%;
            height: 14rem;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .start:active {
            transform: none;
        }

        input:focus {
            box-shadow: none;
        }
    }
</style>
