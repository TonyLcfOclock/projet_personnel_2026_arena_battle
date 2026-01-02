<script>
    import Fight from "../assets/scripts/utils/Fight.svelte.js";
    import Utilities from "../assets/scripts/utils/Utilities.svelte.js";
    import { authUser } from "../assets/scripts/store/auth.svelte.js";
    import { onMount } from "svelte";

    let { gameState = $bindable() } = $props();

    // initialisation du combat et des logs du combat en undefined avant récupération des informations
    let fight = $state(undefined);
    let logs = $state(undefined);

    // initialisation des personnages en undefined avant récupération des informations
    let player = $state(undefined);
    let enemy = $state(undefined);

    // état des personnages
    let playerIsDead = false;
    let enemyIsDead = false;

    // initialisation de l'action du joueur en undefined
    let action = $state(undefined);

    // initialisation des tours du combat
    let turn = $state(0);

    // initialisation du personnage qui joue un tour
    let playTurn = $state(undefined);

    // initialisation de la liste des sorts du personnage à afficher dans la vue
    let playerSpellsList = $state([]);

    // initialisation des propriétés passives des personnages
    let playerPassivesList = $state([]);
    let enemyPassivesList = $state([]);

    // initialisation des propriétés passives des personnages
    let playerBuffsList = $state([]);
    let enemyBuffsList = $state([]);

    // exécuté au montage du component
    onMount(async () => {
        // le serveur envoit les informations nécessaire au début du combat
        const battle = await startBattle();

        // affectation des personnages
        player = battle.player;
        enemy = battle.enemy;
        turn = battle.turn;

        // attribution des logs
        fight = new Fight();
        logs = fight.fightingLogs;

        // log de démarrage du combat
        fight.addLogsLine(battle.log);

        // démarrage du combat
        fighting();
    });

    async function startBattle() {
        // demande au serveur les informations du combat
        const res = await fetch("/api/battle/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(authUser),
        });

        const battle = await res.json();

        return battle;
    }

    async function determineAction(data, act, name) {
        const { id, username, currentBattle } = data;

        const res = await fetch("/api/battle/determine-player-action", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, username, currentBattle, act, name }),
        });

        const spell = await res.json();

        action = spell.action;
    }

    async function fighting() {
        while (playerIsDead === false && enemyIsDead === false) {
            

            let toPlay = await fight.getCharacterHitTurn(authUser);

            player = await fight.reduceCharactersSpellsCooldown(authUser, player.name);
            enemy = await fight.reduceCharactersSpellsCooldown(authUser, enemy.name);

            // affichage des sorts du joueur dans la vue
            playerSpellsList = Utilities.initiatePlayerSpells(player);

            // affichage des propriétés passives des personnages
            playerPassivesList = Utilities.initiatePassives(player);
            enemyPassivesList = Utilities.initiatePassives(enemy);

            // affichage des buffs des personnages
            playerBuffsList = Utilities.initiateBuffs(player);
            enemyBuffsList = Utilities.initiateBuffs(enemy);

            fight.addLogsLine({
                text: `Début du tour ${turn} !`,
                styles: [
                    { word: `tour`, color: "grey" },
                    { word: `${turn}`, color: "grey" },
                ],
            });

            await Utilities.sleep(1500);

            if (toPlay) {
                // tour du joueur

                playTurn = player.name;

                let negateLog = [];

                // affectations par destructuration de la réponse
                ({ character: player, log: negateLog } = await fight.checkCharacterNegativeEffectStates(authUser, player.name));

                negateLog.forEach((element) => fight.addLogsLine(element));

                if (fight.canPlayTurn(player)) {
                    player = await fight.refreshCharacterBuff(authUser, player.name);

                    player = await fight.passivePerTurn(authUser, enemy.name, player.name);

                    // attente de choix d'une action
                    while (!action) {
                        await Utilities.sleep(50);
                    }

                    let spellLog;

                    ({ target: enemy, self: player, log: spellLog } = await fight.actionToDo(authUser, action, enemy.name, player.name));

                    spellLog.forEach((element) => fight.addLogsLine(element));
                }
            } else {
                playTurn = enemy.name;

                let negateLog = [];

                ({ character: enemy, log: negateLog } = await fight.checkCharacterNegativeEffectStates(authUser, enemy.name));

                negateLog.forEach((element) => fight.addLogsLine(element));

                if (fight.canPlayTurn(enemy)) {
                    enemy = await fight.refreshCharacterBuff(authUser, enemy.name);

                    enemy = await fight.passivePerTurn(authUser, player.name, enemy.name);

                    let act;

                    ({ action: act } = await fight.randomAction(authUser, enemy.name));

                    let spellLog;

                    ({ target: player, self: enemy, log: spellLog } = await fight.actionToDo(authUser, act, player.name, enemy.name));

                    spellLog.forEach((element) => fight.addLogsLine(element));
                }
            }

            turn++;
            action = undefined;
            playTurn = undefined;

            if (player.statistics.HP <= 0) {
                playerIsDead = true;
                return;
            } else if (enemy.statistics.HP <= 0) {
                enemyIsDead = true;
                return;
            }
        }
    }
</script>

{#if player}
    <main>
        <section class="characters-hp-stats">
            <div class="player">
                <div class="player-name-class">
                    <p>{ player.name }</p>
                    <p>Class</p>
                </div>

                <div class="player-bars">
                    <div class="health">
                        <div class="health-text">
                            <p class="hp">HP</p>
                            <p>{`${player.statistics.HP <= 0 ? 0 : player.statistics.HP} / ${player.statistics.maxHP}`}</p>
                        </div>

                        <div class="healthbar">
                            <div style={`width: ${player.statistics.HP <= 0 ? 0 : (player.statistics.HP * 100) / player.statistics.maxHP}%`} class="health-fill"></div>
                        </div>
                    </div>
                </div>

                <div class="statistics">
                    <p><span>STR</span> {`${player.statistics.STR}`}</p>
                    <p><span>ARM</span> {`${player.statistics.ARM}`}</p>
                    <p><span>SPEED</span> {`${player.statistics.speed}`}</p>
                    <p><span>CRIT %</span> {`${Math.round(player.statistics.CritChance.toFixed(1) * 100)}`}</p>
                    <p><span>CRIT DMG%</span> {`${Math.round(player.statistics.CritDamage.toFixed(1) * 100)}`}</p>
                </div>
                <div class="passives">
                    {#each playerPassivesList as passive}
                        {#if passive.display}
                        <div class="passive">
                            <div class="passive-info">{passive.description}</div>
                            <p>{passive.stacks > 0 ? `${passive.name}: ${passive.stacks}` : `${passive.name}`}</p>
                        </div>
                        {/if}
                    {/each}
                </div>
                <div class="buffs-debuffs">
                    {#each playerBuffsList as buff}
                        {#if buff.state}
                            <p class="buff">{buff.name}</p>
                        {/if}
                    {/each}
                    <!-- <p class="debuff">Debuff</p> -->
                </div>
            </div>

            <div class="playing-turn">
                {#if playTurn === player.name}
                <p>À VOUS DE JOUER !</p>
                {/if}
            </div>

            <div class="enemy">
                <div class="enemy-name-class">
                    <p>{ enemy.name }</p>
                    <p>Class</p>
                </div>

                <div class="enemy-bars">
                    <div class="health">
                        <div class="health-text">
                            <p class="hp">HP</p>
                            <p>{`${enemy.statistics.HP <= 0 ? 0 : enemy.statistics.HP} / ${enemy.statistics.maxHP}`}</p>
                        </div>
                        <div class="healthbar">
                            <div style={`width: ${enemy.statistics.HP <= 0 ? 0 : (enemy.statistics.HP * 100) / enemy.statistics.maxHP}%`} class="health-fill"></div>
                        </div>
                    </div>
                </div>

                <div class="statistics">
                    <p><span>STR</span> {`${enemy.statistics.STR}`}</p>
                    <p><span>ARM</span> {`${enemy.statistics.ARM}`}</p>
                    <p><span>SPEED</span> {`${enemy.statistics.speed}`}</p>
                    <p><span>CRIT %</span> {`${Math.round(enemy.statistics.CritChance.toFixed(1) * 100)}`}</p>
                    <p><span>CRIT DMG%</span> {`${Math.round(enemy.statistics.CritDamage.toFixed(1) * 100)}`}</p>
                </div>
                <div class="passives">
                    {#each enemyPassivesList as passive}
                        {#if passive.display}
                            <div class="passive">
                                <div class="passive-info">{passive.description}</div>
                                <p>{passive.stacks > 0 ? `${passive.name}: ${passive.stacks}` : `${passive.name}`}</p>
                            </div>
                        {/if}
                    {/each}
                </div>
                <div class="buffs-debuffs">
                    {#each enemyBuffsList as buff}
                        {#if buff.state}
                            <p class="buff">{buff.name}</p>
                        {/if}
                    {/each}
                    <!-- <p class="debuff">Debuff</p> -->
                </div>
            </div>
        </section>

        <section class="characters-fight">
            <div class="fight-zone">
                <div class="characters">
                    <img
                        src={ player.image }
                        alt=""
                    />
                    <img
                        style="transform: scaleX(-1);"
                        src={ enemy.image }
                        alt=""
                    />
                </div>
            </div>
        </section>
        <section class="utilities">

            <div class="spells">
                <div class="title">
                    <p>Sorts</p>
                </div>
                {#each playerSpellsList as spell}
                    <div
                        class="spell"
                        class:is-cooldown={Utilities.checkSpellIsOnCooldown(
                            spell,
                            player.spells,
                        )}
                        onclick={() => {
                            determineAction(authUser, spell.name, player.name);
                        }}
                    >
                    {#if Utilities.checkSpellIsOnCooldown(spell, player.spells)}
                        <span class="veil" aria-hidden="true">
                            <p>{ player.spells.find(element => element.name === spell.name).currentCooldown }</p>
                        </span>
                    {/if}
                        <img
                            class="spell-icon"
                            src={spell.image}
                            alt={spell.name}
                        />
                        <div class="spell-info">
                            <img
                                class="icon-info"
                                src="/images/ui/icons/information.png"
                                alt=""
                            />
                            <div class="text-info">
                                {spell.description}
                            </div>
                        </div>
                        <p>{ spell.name }</p>
                    </div>
                {/each}
            </div>

            <div class="logs">
                <div class="title">
                    <p>Journaux de combat</p>
                </div>
                <div class="text">
                    {#each logs as line}
                        <p>
                            {#each fight.buildLogsText(line) as word}
                                {#if word.style}
                                    <span style={word.style}>{word.text}</span>
                                {:else}
                                    {word.text}
                                {/if}
                            {/each}
                        </p>
                    {/each}
                </div>
            </div>
        </section>
        <section class="menu">
            <div class="info">
                {#if playTurn === player.name}
                <p>Au tour de {player.name}</p>
                {:else if playTurn === enemy.name}
                <p>Au tour de {enemy.name}</p>
                {:else}
                <p>En attente du combat...</p>
                {/if}
                
                <p>Turn {turn}</p>
            </div>
        </section>
    </main>
{/if}
