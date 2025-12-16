import Utilities from '../scripts/utils/Utilities.js';
import DeathKnight from '../scripts/characters/DeathKnight.js';
import Baron from '../scripts/characters/Baron.js';

class SelectionController {

    initialiseCharacters(_req, res) {
        const characters = [new DeathKnight(), new Baron()];

        return res.status(200).json(characters);
    }
}

export default new SelectionController();