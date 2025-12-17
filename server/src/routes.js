import { Router } from "express";
import FightController from './controllers/FightController.js';
import SelectionController from "./controllers/SelectionController.js";

const router = Router();

//routes de séléction de personnage
router.get('/api/init', SelectionController.initialiseCharacters);
router.post('/api/initialiseBattle', SelectionController.initialiseBattle);

// routes de combat
router.post('/api/battle/', FightController.startBattle);
router.post('/api/battle/turn/', FightController.chooseCharacterHitTurn);
router.post('/api/battle/reduce-character-spells-cd', FightController.reduceCharacterSpellsCooldown);
router.post('/api/battle/check-character-negative-effect', FightController.checkCharacterNegativeEffectStates);
router.post('/api/battle/check-character-buffs', FightController.checkCharacterBuffs);
router.post('/api/battle/passive-per-turn', FightController.passivePerTurn);
router.post('/api/battle/determine-player-action', FightController.determinePlayerAction);
router.post('/api/battle/determine-enemy-action', FightController.determineEnemyAction);
router.post('/api/battle/character-use-spell', FightController.characterUseSpell);

export default router;