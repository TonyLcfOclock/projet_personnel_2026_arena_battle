<script module>
    import humans from '../assets/data/characters/humans.js';
    import monsters from '../assets/data/characters/monsters.js';
    import * as fights from '../assets/code/fight.js';
    import * as utilities from '../assets/code/utilities.js';
    import Characters from '../assets/data/characters/Character.svelte.js';
    import Fight from '../assets/code/Fight.svelte.js';


    const fight = new Fight('Testing Fight');
    const logs = fight.fightingLogs;

    let action = $state(null);

    function determineAction(act, player) {
        for (let key in player.spells) {
            if (player.spells[key].currentCooldown > 0) {
                continue;
            }

            if (player.spells[key].name === act) {
                action = act
                return;
            } 
        }
    }

    async function fighting() {
        while (playerIsDead === false && enemyIsDead === false) {
            turn ++;
            
            let playerHitChance = fights.calculateChance(player.statistics.speed);
            let enemyHitChance = fights.calculateChance(enemy.statistics.speed);

            let toPlay = fights.calculateHitChance(playerHitChance, enemyHitChance);

            fights.reduceCooldown(player.spells);
            fights.reduceCooldown(enemy.spells);

            fight.addLogsLine({
                text: `Début du tour ${turn} !`,
                styles: 
                    [   
                    { word: `tour`, color: 'grey'},
                    { word: `${turn}`, color: 'grey'},
                ]
            });

            await utilities.sleep(1500);

            if (toPlay) {
                // tour du joueur
                let check = fights.checkStates(player);

                if (check) {
                    fights.refreshBuff(enemy, player);
                    player.passives.perTurn(enemy, player);

                    // attente de choix d'une action
                    while (action === null) {
                        await utilities.sleep(50);
                    }

                    fights.actionToDo(action, player, enemy);
                    enemy.passives.onHit(player, enemy);
                }
            } else {
                let check = fights.checkStates(enemy);

                if (check) {
                    fights.refreshBuff(player, enemy);
                    enemy.passives.perTurn(player, enemy);

                    let act = fights.randomAction(enemy, player);
                    // let act = "Sanguine Bite"
                    fights.actionToDo(act, enemy, player);
                    player.passives.onHit(enemy, player);
                }
            }

            action = null;

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
        const playerSpells = Object.entries(player.spells);

        playerSpellsList = playerSpells.map((element) => {
            return { name: element[1].name, image: element[1].image, description: element[1].description }
        });
    }

    function initiateCharacterImage(char) {
        return char.image
    }

    // affectation des personnages
    let player = new Characters(humans.verso);
    let enemy = new Characters(monsters.baron);


    // état des personnages
    let playerIsDead = false;
    let enemyIsDead = false;

    let turn = $state(0);
    let playerSpellsList = $state([]);

    fight.addLogsLine({
        text: `Un combat est engagé entre ${player.name} et ${enemy.name} !`,
        styles: []
    });

    initiatePlayerSpells(player);
    fighting();
</script>

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
            {#if player.negativeEffects.stun.duration != 0}
                <p>Stuned: {player.negativeEffects.stun.duration}</p>
            {/if}
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
                        determineAction(spell.name, player);
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