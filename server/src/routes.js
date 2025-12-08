import { Router } from "express";
import FightController from './controllers/FightController.js';

const router = Router();

router.post('/api/battle/', FightController.initiateBattle);
router.post('/api/battle/turn/', FightController.chooseCharacterHitTurn);

export default router;