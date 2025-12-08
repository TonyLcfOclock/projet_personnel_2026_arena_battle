import DeathKnight from '../scripts/characters/DeathKnight.js';
import Baron from '../scripts/characters/Baron.js';

class FightController {

    static initiateBattle(req, res) {
        const player = new DeathKnight('Verso');
        const enemy = new Baron('Baron');

        const characters = [player, enemy];

        res.status(200).json(characters);
    }
    
    calculateCharacterHitChance(speed) {
        return Math.floor(Math.random() * speed);
    }

    static chooseCharacterHitTurn(req, res) {
        let objs = req.body;
        console.log(objs)
        res.status(200).json(true);
    }
}

export default FightController;