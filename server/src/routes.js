import { Router } from "express";
import FightController from './controllers/FightController.js';
import SelectionController from "./controllers/SelectionController.js";
import AuthMiddleware from "./middlewares/AuthMiddleware.js";
import AuthController from "./controllers/AuthController.js";

const router = Router();

//routes d'authentification
router.post('/api/auth/register', AuthController.register);
router.post('/api/auth/login', AuthController.login);

//routes de séléction de personnage
router.get('/api/init', AuthMiddleware.requireAuth, SelectionController.initialiseCharacters);
router.post('/api/initialiseBattle', AuthMiddleware.requireAuth, SelectionController.initialiseBattle);

// routes de combat
router.post('/api/battle/', AuthMiddleware.requireAuth, FightController.startBattle);
router.post('/api/battle/turn/', AuthMiddleware.requireAuth, FightController.chooseCharacterHitTurn);
router.post('/api/battle/reduce-character-spells-cd', AuthMiddleware.requireAuth, FightController.reduceCharacterSpellsCooldown);
router.post('/api/battle/check-character-negative-effect', AuthMiddleware.requireAuth, FightController.checkCharacterNegativeEffectStates);
router.post('/api/battle/check-character-buffs', AuthMiddleware.requireAuth, FightController.checkCharacterBuffs);
router.post('/api/battle/passive-per-turn', AuthMiddleware.requireAuth, FightController.passivePerTurn);
router.post('/api/battle/determine-player-action', AuthMiddleware.requireAuth, FightController.determinePlayerAction);
router.post('/api/battle/determine-enemy-action', AuthMiddleware.requireAuth, FightController.determineEnemyAction);
router.post('/api/battle/character-use-spell', AuthMiddleware.requireAuth, FightController.characterUseSpell);

export default router;