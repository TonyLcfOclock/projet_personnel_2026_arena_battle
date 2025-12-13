<script>
    import Fight from "../assets/scripts/utils/Fight.svelte.js";
    import Utilities from "../assets/scripts/utils/Utilities.svelte.js";
    import { onMount } from "svelte";

    // initialisation du combat et des logs du combat en undefined avant récupération des informations
    let fight = $state(undefined);
    let battleId = $state(undefined);
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

    // exécuté au montage du component
    onMount(async () => {
        // le serveur envoit les informations nécessaire au début du combat
        const battle = await initialiseBattle();

        // affectation des personnages
        player = battle.player;
        enemy = battle.enemy;

        // attribution des logs
        fight = new Fight(battle.fightName);
        battleId = battle.battleId;
        logs = fight.fightingLogs;

        // log de démarrage du combat
        fight.addLogsLine(battle.log);

        // démarrage du combat
        fighting();
    });

    async function initialiseBattle() {
        // demande au serveur les informations du combat
        const res = await fetch("/api/battle/");

        const battle = await res.json();

        return battle;
    }

    async function determineAction(battleId, act, name) {
        const res = await fetch("/api/battle/determine-player-action", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: battleId, act, name }),
        });

        const spell = await res.json();

        action = spell.action;
    }

    async function fighting() {
        while (playerIsDead === false && enemyIsDead === false) {
            turn++;

            let toPlay = await fight.getCharacterHitTurn(battleId);

            player = await fight.reduceCharactersSpellsCooldown(
                battleId,
                player.name,
            );
            enemy = await fight.reduceCharactersSpellsCooldown(
                battleId,
                enemy.name,
            );

            // affichage des sorts du joueur dans la vue
            playerSpellsList = Utilities.initiatePlayerSpells(player);

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
                ({ char: player, log: negateLog } =
                    await fight.checkCharacterNegativeEffectStates(
                        battleId,
                        player.name,
                    ));

                negateLog.forEach((element) => {
                    fight.addLogsLine(element);
                });

                if (fight.canPlayTurn(player)) {
                    player = await fight.refreshCharacterBuff(
                        battleId,
                        player.name,
                    );
                    player = await fight.passivePerTurn(
                        battleId,
                        enemy.name,
                        player.name,
                    );

                    // attente de choix d'une action
                    while (!action) {
                        await Utilities.sleep(50);
                    }

                    let spellLog;

                    ({
                        target: enemy,
                        self: player,
                        log: spellLog,
                    } = await fight.actionToDo(
                        battleId,
                        action,
                        enemy.name,
                        player.name,
                    ));

                    fight.addLogsLine(spellLog);
                    // enemy.perHit(player, enemy, fight);
                }
            } else {
                playTurn = enemy.name;

                let negateLog = [];

                ({ char: enemy, log: negateLog } =
                    await fight.checkCharacterNegativeEffectStates(
                        battleId,
                        enemy.name,
                    ));

                negateLog.forEach((element) => {
                    fight.addLogsLine(element);
                });

                if (fight.canPlayTurn(enemy)) {
                    enemy = await fight.refreshCharacterBuff(
                        battleId,
                        enemy.name,
                    );
                    enemy = await fight.passivePerTurn(
                        battleId,
                        player.name,
                        enemy.name,
                    );

                    let act;
                    ({ action: act } = await fight.randomAction(
                        battleId,
                        enemy.name,
                        player.name,
                    ));

                    let spellLog;
                    ({
                        target: player,
                        self: enemy,
                        log: spellLog,
                    } = await fight.actionToDo(
                        battleId,
                        act,
                        player.name,
                        enemy.name,
                    ));

                    fight.addLogsLine(spellLog);
                    // player.perHit(enemy, player, fight);
                }
            }

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
                    <p><span>CRIT %</span> {`${player.statistics.CritChance}`}</p>
                    <p><span>CRIT DMG%</span> {`${player.statistics.CritDamage}`}</p>
                </div>
                <div class="passives">
                    <p>Passive</p>
                </div>
                <div class="buffs-debuffs">
                    <p class="buff">Buff</p>
                    <p class="debuff">Debuff</p>
                </div>
            </div>

            <div class="playing-turn">
                {#if playTurn === player.name}
                <p>A VOUS DE JOUER</p>
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
                            <p>{`${enemy.statistics.HP <= 0 ? 0 : enemy.statistics.HP} / ${enemy.statistics.maxHP}`}</p>
                            <p>HP</p>
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
                    <p><span>CRIT %</span> {`${enemy.statistics.CritChance}`}</p>
                    <p><span>CRIT DMG%</span> {`${enemy.statistics.CritDamage}`}</p>
                </div>
                <div class="passives">
                    <p>Passive</p>
                </div>
                <div class="buffs-debuffs">
                    <p class="buff">Buff</p>
                    <p class="debuff">Debuff</p>
                </div>
            </div>
        </section>

        <section class="characters-fight">
            <div class="fight-zone">
                <div class="characters">
                    <img
                        src="./src/assets/art/characters/humans/classes/death_knight/death_knight1.png"
                        alt=""
                    />
                    <img
                        src="./src/assets/art/characters/monsters/boss/baron.png"
                        alt=""
                    />
                </div>
            </div>
        </section>
        <section class="utilities">
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

            <div class="spells">
                <div class="title">
                    <p>Sorts</p>
                </div>
                {#each playerSpellsList as spell}
                    <div
                        class="spell"
                        onclick={() => {
                            determineAction(battleId, spell.name, player.name);
                        }}
                    >
                    {#if Utilities.checkSpellIsOnCooldown(spell, player.spells)}
                        <span class="veil" aria-hidden="true">
                            <p>{ player.spells.find(element => element.name === spell.name).currentCooldown}</p>
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
                                src="./src/assets/art/ui/icons/information.png"
                                alt=""
                            />
                            <div class="text-info">
                                {spell.description}
                            </div>
                        </div>
                    </div>
                {/each}
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
