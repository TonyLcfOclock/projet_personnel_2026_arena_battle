import BattleStore from '../scripts/BattleStore.js';
import Fight from '../scripts/utils/Fight.js';
import Utilities from '../scripts/utils/Utilities.js';

class FightController {

    // méthode d'instance qui démarre un combat en utilisant BattleStore
    async startBattle(req, res) {
        const { currentBattle } = req.body;

        const battle = await BattleStore.getBattle(currentBattle);

        const { turn, data } = battle;
        const { player, enemy } = data;

        const log = {
            text: `Un combat est engagé entre ${player.name} et ${enemy.name} !`,
            styles: [],
        }

        res.status(200).json({
            player,
            enemy,
            turn,
            log,
        });
    }

    // méthode d'instance qui choisit quel personnage joue le tour
    async chooseCharacterHitTurn(req, res) {
        const { id, username, currentBattle } = req.body;
        const battle = await BattleStore.getBattle(currentBattle);

        const { data } = battle;
        const { player, enemy } = data;

        const playerSpeed = player.statistics.speed;
        const enemySpeed = enemy.statistics.speed;

        const playerHitChance = Fight.calculateCharacterHitChance(playerSpeed);
        const enemyHitChance = Fight.calculateCharacterHitChance(enemySpeed);

        const toPlay = Fight.chooseCharacterHitTurn(playerHitChance, enemyHitChance);

        res.status(200).json(toPlay);
    }

    // méthode d'instance qui réduit les temps de récupérations des sorts des personnages
    async reduceCharacterSpellsCooldown(req, res) {
        const { currentBattle, name } = req.body;

        const battle = await BattleStore.getBattle(currentBattle);
        
        const char = Object.values(battle.data).find(element => element.name === name);

        Fight.reduceCharacterSpellsCooldown(char.spells);

        await BattleStore.updateBattle(battle.data, currentBattle);

        res.status(200).json(char);
    }

    // méthode d'instance qui vérifie les états négatif des personnages
    async checkCharacterNegativeEffectStates(req, res) {
        const { currentBattle, name } = req.body;

        const battle = await BattleStore.getBattle(currentBattle);

        const entry = Object.entries(battle.data).find(element => element[1].name === name);
        const [ key, savedChar ] = entry;

        const character = Fight.createCharacter(savedChar);
        
        const logs = [];

        character.negativeEffects.forEach(negate => {
            if (negate.state && negate.duration >= 0) {
                logs.push(negate.applyNegativeEffect(character));
                Fight.reduceCharacterNegativeEffectDuration(negate);
            }
        }) 

        battle.data[key] = character;

        await BattleStore.updateBattle(battle.data, currentBattle);

        res.status(200).json({
            character,
            log: logs
        });
    }

    // méthode d'instance qui vérifie les buffs d'un personnage
    async checkCharacterBuffs(req, res) {
        const { currentBattle, name } = req.body;

        const battle = await BattleStore.getBattle(currentBattle);

        const entry = Object.entries(battle.data).find(element => element[1].name === name);
        const [ key, savedChar ] = entry;

        const character = Fight.createCharacter(savedChar);

        character.buffs.forEach(buff => {
            buff.checkBuff(character);
        })

        battle.data[key] = character;

        await BattleStore.updateBattle(battle.data, currentBattle);

        res.status(200).json(character);
    }

    // méthode d'instance qui utilise les passifs des personnages
    async passivePerTurn(req, res) {
       const { currentBattle, targetName, selfName } = req.body;

        const battle = await BattleStore.getBattle(currentBattle);

        const targetEntry = Object.entries(battle.data).find(element => element[1].name === targetName);
        const [ targetKey, targetSavedChar ] = targetEntry;

        const selfEntry = Object.entries(battle.data).find(element => element[1].name === selfName);
        const [ selfKey, selfSavedChar ] = selfEntry;

        const target = Fight.createCharacter(targetSavedChar);
        const self = Fight.createCharacter(selfSavedChar);

        self.perTurn(target, self);

        battle.data[targetKey] = target;
        battle.data[selfKey] = self;

        await BattleStore.updateBattle(battle.data, currentBattle);

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