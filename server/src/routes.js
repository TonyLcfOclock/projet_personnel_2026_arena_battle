import { Router } from "express";
import Fight from './controllers/fight.controller.js';

const router = Router();
const battle = new Fight();

router.post('/api/battle/', battle.initiateCharacters);
router.post('/api/battle/turn/', battle.chooseCharacterHitTurn);

export default router;