<script>
    import Fight from '../assets/utils/Fight.svelte.js';
    import Utilities from '../assets/utils/Utilities.svelte.js';
    import DeathKnight from '../assets/scripts/characters/DeathKnight.svelte.js';
    import Baron from '../assets/scripts/characters/Baron.svelte.js';


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
            
            let playerHitChance = fight.calculateCharacterHitChance(player.statistics.speed);
            let enemyHitChance = fight.calculateCharacterHitChance(enemy.statistics.speed);

            let toPlay = fight.chooseCharacterHitTurn(playerHitChance, enemyHitChance);

            fight.reduceCharacterSpellsCooldown(player.spells);
            fight.reduceCharacterSpellsCooldown(enemy.spells);

            fight.addLogsLine({
                text: `Début du tour ${turn} !`,
                styles: 
                    [   
                    { word: `tour`, color: 'grey'},
                    { word: `${turn}`, color: 'grey'},
                ]
            });

            await Utilities.sleep(1500);

            if (toPlay) {
                // tour du joueur
                let check = fight.checkCharacterNegativeEffectStates(player, fight);

                if (check) {
                    fight.refreshCharacterBuff(enemy, player);
                    player.perTurn(enemy, player);

                    // attente de choix d'une action
                    while (action === null) {
                        await Utilities.sleep(50);
                    }

                    fight.actionToDo(action, player, enemy, fight);
                    enemy.perHit(player, enemy, fight);
                }
            } else {
                let check = fight.checkCharacterNegativeEffectStates(enemy, fight);

                if (check) {
                    fight.refreshCharacterBuff(player, enemy);
                    enemy.perTurn(player, enemy);

                    let act = fight.randomAction(enemy, player);
                    // let act = "Sanguine Bite"
                    fight.actionToDo(act, enemy, player, fight);
                    player.perHit(enemy, player, fight);
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
        playerSpellsList = player.spells.map((element) => {
            console.log(element)
            return { name: element.name, image: element.image, description: element.description }
        });
    }

    function initiateCharacterImage(char) {
        return char.image
    }

    // affectation des personnages
    let player = new DeathKnight("Verso");

    let enemy = new Baron("Baron");

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