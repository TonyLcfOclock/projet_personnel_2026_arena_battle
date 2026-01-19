# User stories - Arena Battle

## Authentification et session
- En tant que joueur, je veux créer un compte afin de sauvegarder mes combats.
  - Critère: je peux saisir un username et un mot de passe valides.
  - Critère: une session est créée apres inscription réussie.

- En tant que joueur, je veux me connecter afin d'acceder à mon compte.
  - Critère: une erreur est affichée si les identifiants sont invalides.
  - Critère: un cookie de session httpOnly est posé après connexion.

- En tant que joueur, je veux me déconnecter afin de protéger mon compte.
  - Critère: le cookie de session est supprimé.
  - Critère: je suis redirigé vers l'écran de connexion.

- En tant que joueur, je veux retrouver ma session active afin d'éviter de me reconnecter.
  - Critère: l'API renvoie mes infos si le cookie est valide.
  - Critère: l'UI affiche l'état connecté automatiquement.

## Sélection et démarrage de combat
- En tant que joueur, je veux consulter les personnages disponibles afin de choisir mon combattant.
  - Critère: la liste des personnages est chargée depuis l'API.

- En tant que joueur, je veux sélectionner mon personnage afin de lancer un duel 1v1.
  - Critère: un combat est initialisé côté serveur.
  - Critère: je suis redirigé vers l'écran de combat.

## Combat tour par tour
- En tant que joueur, je veux voir l'état du combat afin de comprendre la situation.
  - Critère: les PV, effets et tours en cours sont visibles.

- En tant que joueur, je veux choisir une action (sort, attaque, défense) afin de jouer mon tour.
  - Critère: seules les actions disponibles sont cliquables.
  - Critère: les cooldowns sont respectés apres utilisation.

- En tant que joueur, je veux que l'ennemi joue automatiquement afin que le duel continue.
  - Critère: l'IA choisit une action au tour ennemi.

- En tant que joueur, je veux que les buffs, débuffs et effets négatifs soient appliqués afin que les règles du jeu soient respectées.
  - Critère: les effets sont recalculés à chaque tour.
  - Critère: les effets ont une durée et expirent correctement.

- En tant que joueur, je veux savoir si un personnage est KO afin de terminer le combat.
  - Critère: la fin de combat est décidée côté serveur.
  - Critère: l'écran affiche victoire ou defaite.

## Journal et historique
- En tant que joueur, je veux consulter le journal de combat afin de suivre les actions.
  - Critère: chaque action est ajoutée au journal dans l'ordre des tours.

- En tant que joueur, je veux retrouver un combat en cours afin de le reprendre.
  - Critère: l'état du combat est chargé depuis la base.
  - Critère: le tour courant est conservé.

## Persistance et données
- En tant que joueur, je veux que les combats soient sauvegardés afin de ne pas perdre ma progression.
  - Critère: l'état, le tour et les données de combat sont stockés.

- En tant que joueur, je veux que mon compte référence mon combat actuel afin de reprendre rapidement.
  - Critère: l'utilisateur a un champ current_battle.