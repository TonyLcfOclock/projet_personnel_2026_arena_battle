import BattleStore from '../scripts/BattleStore.js';

//import des personnages
import DeathKnight from '../scripts/characters/DeathKnight.js';
import Baron from '../scripts/characters/Baron.js';
import DimensionalDevourer from '../scripts/characters/DimensionalDevourer.js';

class SelectionController {

    initialiseCharacters(_req, res) {
        const characters = [
            new DeathKnight("DeathKnight"),
            new Baron("Baron"),
            new DimensionalDevourer("Dimensional Devourer")
        ];

        return res.status(200).json(characters);
    }

    // méthode d'instance qui initialise un combat en utilisant BattleStore
    async initialiseBattle(req, res) {
        const { userId, playerClass, playerName, enemyClass, enemyName } = req.body;

        let playerCharacter;
        let enemyCharacter;

        switch(playerClass) {
            case "DeathKnight":
                playerCharacter = new DeathKnight(playerName);
                break;
            case "Baron":
                playerCharacter = new Baron(playerName);
                break;
            case "Dimensional Devourer":
                playerCharacter = new DimensionalDevourer(playerName);
                break;
        }

        switch(enemyClass) {
            case "DeathKnight":
                enemyCharacter = new DeathKnight(enemyName);
                break;
            case "Baron":
                enemyCharacter = new Baron(enemyName);
                break;
            case "Dimensional Devourer":
                enemyCharacter = new DimensionalDevourer(enemyName);
                break;
        }

        const battle = await BattleStore.createBattle(userId, playerCharacter, enemyCharacter);
        const { id } = battle;

        res.status(200).json({
            battleId: id,
        });
    }
}

export default new SelectionController();