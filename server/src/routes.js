import { Router } from "express";
import FightController from './controllers/FightController.js';

const router = Router();

router.get('/api/battle/', FightController.initialiseBattle);
router.post('/api/battle/turn/', FightController.chooseCharacterHitTurn);
router.post('/api/battle/reduce-character-spells-cd', FightController.reduceCharacterSpellsCooldown);
router.post('/api/battle/check-character-negative-effect', FightController.checkCharacterNegativeEffectStates);
router.post('/api/battle/check-character-buffs', FightController.checkCharacterBuffs);
router.post('/api/battle/passive-per-turn', FightController.passivePerTurn);
router.post('/api/battle/determine-player-action', FightController.determinePlayerAction);

export default router;