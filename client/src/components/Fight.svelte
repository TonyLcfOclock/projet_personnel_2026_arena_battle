<script>
    import Fight from "../assets/utils/Fight.svelte.js";
    import Utilities from "../assets/utils/Utilities.svelte.js";
    import { onMount } from "svelte";

    // initialisation du combat et des logs du combat en undefined avant récupération des informations
    let fight = $state(undefined);
    let battleId = $state(undefined);
    let logs = $state(undefined);

    // initialisation des personnages en undefined avant récupération des informations
    let player = $state(undefined);
    let enemy = $state(undefined);
    
    // initialisation de l'action du joueur en undefined
    let action = $state(undefined);

    // exécuté au montage du component
    onMount( async () => {
        // le serveur envoit les informations nécessaire au début du combat
        const battle = await initialiseBattle();

        // affectation des personnages
        player = battle.player;
        enemy = battle.enemy;

        // attribution des logs
        fight = new Fight(battle.fightName);
        battleId = battle.battleId
        logs = fight.fightingLogs;

        // initialisation des sorts du joueur 
        initiatePlayerSpells(player);

        // log de démarrage du combat
        fight.addLogsLine(battle.log);

        // démarrage du combat
        fighting();
    });

    async function initialiseBattle() {
        // demande au serveur les informations du combat
        const res = await fetch('/api/battle/');

        const battle = await res.json();

        return battle;
    };

    async function determineAction(battleId, act, name) {
        const res = await fetch("/api/battle/determine-player-action", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: battleId, act, name }),
        });

        const spell = await res.json();

        action = spell.action;
    }

    async function getCharacterHitTurn(battleId) {
        const res = await fetch("/api/battle/turn/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: battleId }),
        });

        const toPlay = await res.json();
        return toPlay;
    }

    function canPlayTurn(character) {
        const stunEffect = character.negativeEffects.find(negate => negate.name === "Stun");

        return !stunEffect.state;
    }

    async function fighting() {

        while (playerIsDead === false && enemyIsDead === false) {
            turn++;

            let toPlay = await getCharacterHitTurn(battleId);

            player = await fight.reduceCharactersSpellsCooldown(battleId, player.name);
            enemy = await fight.reduceCharactersSpellsCooldown(battleId, enemy.name);

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
                let negateLog = [];

                ({ char: player, log: negateLog } = await fight.checkCharacterNegativeEffectStates(battleId, player.name));

                negateLog.forEach(element => {
                    fight.addLogsLine(element);
                });

                if (canPlayTurn(player)) {
                    player = await fight.refreshCharacterBuff(battleId, player.name);
                    player = await fight.passivePerTurn(battleId, enemy.name, player.name);

                    // attente de choix d'une action
                    while (!action) {
                        await Utilities.sleep(50);
                    }

                    let spellLog;

                    ({ target: enemy, self: player,  log: spellLog} = await fight.actionToDo(battleId, action, enemy.name, player.name));

                    fight.addLogsLine(spellLog);
                    console.log(player)
                    // enemy.perHit(player, enemy, fight);
                }
            } else {
                let negateLog = [];

                ({ char: enemy, log: negateLog } = await fight.checkCharacterNegativeEffectStates(battleId, enemy.name));
                
                negateLog.forEach(element => {
                    fight.addLogsLine(element);
                });

                if (canPlayTurn(enemy)) {
                    enemy = await fight.refreshCharacterBuff(battleId, enemy.name);
                    enemy = await fight.passivePerTurn(battleId, player.name, enemy.name);

                    let act;
                    ({ action: act } = await fight.randomAction(battleId, enemy.name, player.name));

                    let spellLog;
                    ({ target: player, self: enemy,  log: spellLog} = await fight.actionToDo(battleId, act, player.name, enemy.name));
                    
                    fight.addLogsLine(spellLog);
                    // player.perHit(enemy, player, fight);
                }
            }

            action = undefined;

            if (player.statistics.HP <= 0) {
                playerIsDead = true;
                return;
            } else if (enemy.statistics.HP <= 0) {
                enemyIsDead = true;
                return;
            }
        }
    }

    function initiatePlayerSpells(player) {
        playerSpellsList = player.spells.map((element) => {
            return {
                name: element.name,
                image: element.image,
                description: element.description,
            };
        });
    }

    function initiateCharacterImage(char) {
        return char.image;
    }

    // état des personnages
    let playerIsDead = false;
    let enemyIsDead = false;

    let turn = $state(0);
    let playerSpellsList = $state([]);
</script>

{#if player}
    

<section id="left-container">
    <div class="playerHealthbarArea">
        <p id="playerName">{player.name}</p>
        <div class="healthbar">
            <div
                style={`width: ${player.statistics.HP <= 0 ? 0 : (player.statistics.HP * 100) / player.statistics.maxHP}%`}
                class="playerFill"
            ></div>
            <div class="health-frame"></div>
        </div>
        <p id="playerHP">
            {`${player.statistics.HP <= 0 ? 0 : player.statistics.HP} / ${player.statistics.maxHP}`}
        </p>
    </div>

    <div class="statisticsArea">
        <p>Statistics</p>
        <div class="playerStats">
            {#each Object.keys(player.statistics) as key}
                <p>{`${key}: ${player.statistics[key].toFixed(1)}`}</p>
            {/each}
        </div>
    </div>

    <div class="buffsArea">
        <p>Buffs</p>
        <div class="buffs"></div>
    </div>

    <div class="nEffectsArea">
        <p>Negative Effects</p>
        <div class="nEffets">
            <!-- {#if player.negativeEffects.stun.duration != 0}
                <p>Stuned: {player.negativeEffects.stun.duration}</p>
            {/if} -->
        </div>
    </div>

    <div class="playerSpellsArea">
        {#each Object.keys(player.spells) as key}
            <p>{`${player.spells[key].name}:`}</p>
            <span>{`Cooldown: ${player.spells[key].currentCooldown}`}</span>
        {/each}
    </div>
</section>
<section id="main-container">
    <div class="char_zone">
        <img class="player" src={initiateCharacterImage(player)} alt="" />
        <img class="enemy" src={initiateCharacterImage(enemy)} alt="" />
    </div>
    <div class="fight-info">
        <p>A VOUS DE JOUER</p>
    </div>
    <div class="action_element">
        <div class="fight-zone">
            <div class="fight-frame">
                <div class="fight-text">
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
        </div>
        <div class="spellZone">
            {#each playerSpellsList as spell}
                <div
                    class="spell"
                    onclick={() => {
                        determineAction(battleId, spell.name, player.name);
                    }}
                >
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
    </div>
</section>
<section id="right-container">
    <div class="enemyHealthbarArea">
        <p id="enemyName">{`${enemy.name}`}</p>
        <div class="healthbar">
            <div
                style={`width: ${enemy.statistics.HP <= 0 ? 0 : (enemy.statistics.HP * 100) / enemy.statistics.maxHP}%`}
                class="enemyFill"
            ></div>
            <div class="health-frame"></div>
        </div>
        <p id="enemyHP">
            {`${enemy.statistics.HP <= 0 ? 0 : enemy.statistics.HP} / ${enemy.statistics.maxHP}`}
        </p>
    </div>

    <div class="statisticsArea">
        <p>Statistics</p>
        <div class="enemyStats">
            {#each Object.keys(enemy.statistics) as key}
                <p>{`${key}: ${enemy.statistics[key]}`}</p>
            {/each}
        </div>
    </div>

    <div class="buffsArea">
        <p>Buffs</p>
        <div class="buffs"></div>
    </div>

    <div class="nEffectsArea">
        <p>Negative Effects</p>
        <div class="nEffets"></div>
    </div>

    <div class="enemySpellsArea">
        {#each Object.keys(enemy.spells) as key}
            <p>{`${enemy.spells[key].name}:`}</p>
            <span>{`Cooldown: ${enemy.spells[key].currentCooldown}`}</span>
        {/each}
    </div>
</section>

{/if}