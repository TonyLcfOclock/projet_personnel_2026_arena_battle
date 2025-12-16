import Utilities from '../scripts/utils/Utilities.js';
import DeathKnight from '../scripts/characters/DeathKnight.js';
import Baron from '../scripts/characters/Baron.js';

class SelectionController {

    initialiseCharacters(_req, res) {
        const characters = [new DeathKnight("Deathknight"), new Baron("Baron")];

        return res.status(200).json(characters);
    }

    getCharacterSelected(req, res) {
        const { player, enemy } = req.body;

        
    }
}

export default new SelectionController();