import { Router } from "express";
import FightController from './controllers/FightController.js';

const router = Router();

router.get('/api/battle/', FightController.initialiseBattle);
router.post('/api/battle/turn/', FightController.chooseCharacterHitTurn);

export default router;