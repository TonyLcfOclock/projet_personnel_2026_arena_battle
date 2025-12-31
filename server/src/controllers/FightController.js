import BattleStore from '../scripts/BattleStore.js';
import Utilities from '../scripts/utils/Utilities.js';

class FightController {

    // méthode d'instance qui démarre un combat en utilisant BattleStore
    async startBattle(req, res) {
        const { battleId } = req.body;

        const battle = await BattleStore.getBattle(battleId);

        console.log(battle)
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

    // méthode d'instance qui réduit les temps de récupérations des sorts des personnages
    reduceCharacterSpellsCooldown(req, res) {
        const { id: battleId, name: charName } = req.body;

        const battle = BattleStore.getBattle(battleId);
        
        const char = Object.values(battle).find(element => element.name === charName);

        battle.fight.reduceCharacterSpellsCooldown(char.spells);

        res.status(200).json(char);
    }

    // méthode d'instance qui vérifie les états négatif des personnages
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

    // méthode d'instance qui vérifie les buffs d'un personnage
    checkCharacterBuffs(req, res) {
        const { id: battleId, name: charName} = req.body

        const battle = BattleStore.getBattle(battleId);

        const char = Object.values(battle).find(element => element.name === charName);

        char.buffs.forEach(buff => {
            buff.checkBuff(char);
        })

        res.status(200).json(char);
    }

    // méthode d'instance qui utilise les passifs des personnages
    passivePerTurn(req, res) {
        const { id: battleId, targetName, selfName } = req.body;

        const battle = BattleStore.getBattle(battleId);

        const target = Object.values(battle).find(element => element.name === targetName);
        const self = Object.values(battle).find(element => element.name === selfName);

        self.perTurn(target, self);

        res.status(200).json(self);
    }

    // méthode d'instance qui vérifie les conditions d'utilisation des sorts du joueur
    determinePlayerAction(req, res) {
        const { id: battleId, act: spellName, name: playerName} = req.body;
        let action = undefined;

        const battle = BattleStore.getBattle(battleId);

        const player = Object.values(battle).find(element => element.name === playerName);
        const spell = player.spells.find(spell => spell.name === spellName);

        action = spell.canUseSpell(player) ? spell.name : undefined;

        res.status(200).json({ action });
    }

    // méthode d'instance qui vérifie les conditions d'utilisation des sorts de l'adversaire
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

    // méthode d'instance qui utilise les sorts d'un personnage
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