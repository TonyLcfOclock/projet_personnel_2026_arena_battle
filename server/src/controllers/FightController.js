import BattleStore from '../scripts/BattleStore.js';
import Utilities from '../scripts/utils/Utilities.js';

class FightController {

    // méthode d'instance qui initialise un combat en utilisant BattleStore
    initialiseBattle(_req, res) {
        const battle = BattleStore.createBattle();
        const { id, player, enemy, fight } = battle;

        const log = {
            text: `Un combat est engagé entre ${player.name} et ${enemy.name} !`,
            styles: [],
        }

        res.status(200).json({
            battleId: id,
            fightName: fight.fightName,
            player,
            enemy,
            log
        });
    }

    // méthode d'instance qui choisit quel personnage joue le tour
    chooseCharacterHitTurn(req, res) {
        const battleId = req.body.id;
        const battle = BattleStore.getBattle(battleId);

        const playerSpeed = battle.player.statistics.speed;
        const enemySpeed = battle.enemy.statistics.speed;

        const playerHitChance = battle.fight.calculateCharacterHitChance(playerSpeed);
        const enemyHitChance = battle.fight.calculateCharacterHitChance(enemySpeed);

        const toPlay = battle.fight.chooseCharacterHitTurn(playerHitChance, enemyHitChance);

        res.status(200).json(toPlay);
    }

    reduceCharacterSpellsCooldown(req, res) {
        const { id: battleId, name: charName } = req.body;

        const battle = BattleStore.getBattle(battleId);
        
        const char = Object.values(battle).find(element => element.name === charName);

        battle.fight.reduceCharacterSpellsCooldown(char.spells);

        res.status(200).json(char);
    }

    checkCharacterNegativeEffectStates(req, res) {
        const { id: battleId, name: charName} = req.body

        const battle = BattleStore.getBattle(battleId);

        const char = Object.values(battle).find(element => element.name === charName);
        const logs = [];

        char.negativeEffects.forEach(negate => {
            if (negate.state && negate.duration >= 0) {
                logs.push(negate.applyNegativeEffect(char));
                battle.fight.reduceCharacterNegativeEffectDuration(negate);
            }
        })

        res.status(200).json({
            char,
            log: logs
        });
    }

    checkCharacterBuffs(req, res) {
        const { id: battleId, name: charName} = req.body

        const battle = BattleStore.getBattle(battleId);

        const char = Object.values(battle).find(element => element.name === charName);

        char.buffs.forEach(buff => {
            buff.checkBuff(char);
        })

        res.status(200).json(char);
    }

    passivePerTurn(req, res) {
        const { id: battleId, targetName, selfName } = req.body;

        const battle = BattleStore.getBattle(battleId);

        const target = Object.values(battle).find(element => element.name === targetName);
        const self = Object.values(battle).find(element => element.name === selfName);

        self.perTurn(target, self);

        res.status(200).json(self);
    }

    determinePlayerAction(req, res) {
        const { id: battleId, act: spellName, name: playerName} = req.body;
        let action = undefined;

        const battle = BattleStore.getBattle(battleId);

        const player = Object.values(battle).find(element => element.name === playerName);
        const spell = player.spells.find(spell => spell.name === spellName);

        action = spell.canUseSpell(player) ? spell.name : undefined;

        console.log(`${spell.name} cliqué`);

        res.status(200).json({ action });
    }

     determineEnemyAction(req, res) {
        const { id: battleId, selfName, targetName} = req.body;

        const battle = BattleStore.getBattle(battleId);

        const self = Object.values(battle).find(element => element.name === selfName);
        const target = Object.values(battle).find(element => element.name === targetName);

        const availableSpells = self.spells.filter(spell => {
            return spell.canUseSpell(self, target);
        })

        const randomIndex = Utilities.getRandomInt(availableSpells.length);
        let action = availableSpells[randomIndex].name;
        
        res.status(200).json({ action });
    }

    characterUseSpell(req, res) {
        const { id: battleId, actionName: spellName, targetName, selfName } = req.body;

        const battle = BattleStore.getBattle(battleId);

        const target = Object.values(battle).find(element => element.name === targetName);
        const self = Object.values(battle).find(element => element.name === selfName);

        const spell = self.spells.find(element => element.name === spellName);

        let log = spell.useSpell(target, self, battle);

        res.status(200).json({
            target,
            self,
            log
        })
    }
}

export default new FightController();