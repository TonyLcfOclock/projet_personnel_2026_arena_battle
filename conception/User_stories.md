# User Stories – Arena Battle

## Visiteur

### Accès et consultation
- **En tant que visiteur**, je veux accéder à la page d’accueil afin de comprendre le concept du jeu.  
  - Critère : la page d’accueil est accessible sans authentification.

- **En tant que visiteur**, je veux consulter le bestiaire afin de découvrir les personnages et ennemis.  
  - Critère : la liste du bestiaire est accessible sans compte.  
  - Critère : chaque entrée affiche au minimum le nom et une description.

- **En tant que visiteur**, je veux consulter le classement afin de voir les performances des joueurs.  
  - Critère : le classement est accessible sans authentification.  
  - Critère : les joueurs sont triés selon plusieures règles (victoires, nombres de combat, défaites).

### Compte
- **En tant que visiteur**, je veux créer un compte afin de devenir joueur.  
  - Critère : je peux saisir un username et un mot de passe valides.  
  - Critère : une session est créée après une inscription réussie.  
  - Critère : le compte est créé avec le rôle `membre`.

- **En tant que visiteur**, je veux me connecter afin d’accéder à mon compte.  
  - Critère : une erreur est affichée si les identifiants sont invalides.  
  - Critère : un cookie de session httpOnly est posé après connexion.

## Membre

### Session et paramètres
- **En tant que membre**, je veux retrouver ma session active afin d’éviter de me reconnecter.  
  - Critère : l’API renvoie mes informations si le cookie est valide.  
  - Critère : l’UI affiche l’état connecté automatiquement.

- **En tant que membre**, je veux me déconnecter afin de protéger mon compte.  
  - Critère : le cookie de session est supprimé.  
  - Critère : je suis redirigé vers l’écran de connexion.

- **En tant que membre**, je veux modifier mes paramètres afin de personnaliser mon expérience.  
  - Critère : je peux changer la langue.  
  - Critère : je peux changer le thème (clair/sombre).  
  - Critère : les paramètres sont persistés.

### Profil
- **En tant que membre**, je veux consulter mon profil afin de voir mes informations personnelles.  
  - Critère : mon pseudo, mon rôle et mes statistiques sont visibles.

- **En tant que membre**, je veux changer mon mot de passe afin de sécuriser mon compte.  
  - Critère : l’ancien mot de passe est requis.  
  - Critère : le nouveau mot de passe respecte les règles de sécurité.

- **En tant que membre**, je veux consulter le profil d’un autre joueur afin de comparer nos performances.  
  - Critère : le pseudo et les statistiques du joueur sont visibles.  
  - Critère : aucune donnée sensible n’est exposée.

### Sélection de personnage
- **En tant que membre**, je veux accéder à la page de sélection de personnage afin de préparer un combat.  
  - Critère : la liste des personnages est chargée depuis l’API.

- **En tant que membre**, je veux choisir les sorts de mon personnage afin d’adapter ma stratégie.  
  - Critère : seuls les sorts autorisés pour le personnage sont sélectionnables.  
  - Critère : la sélection est sauvegardée.

- **En tant que membre**, je veux sélectionner un personnage afin de lancer un duel 1v1.  
  - Critère : un combat est initialisé côté serveur.  
  - Critère : le combat est associé à mon compte (`current_battle`).  
  - Critère : je suis redirigé vers l’écran de combat.

## Combat

### Déroulement
- **En tant que membre**, je veux voir l’état du combat afin de comprendre la situation.  
  - Critère : les PV, effets actifs et le tour courant sont visibles.

- **En tant que membre**, je veux choisir une action afin de jouer mon tour.  
  - Critère : seules les actions disponibles sont cliquables.  
  - Critère : les cooldowns sont respectés après utilisation.

- **En tant que membre**, je veux que l’ennemi joue automatiquement afin que le duel progresse.  
  - Critère : l’IA choisit une action valide à son tour.

- **En tant que membre**, je veux que les effets (buffs, débuffs, états) soient appliqués correctement.  
  - Critère : les effets sont recalculés à chaque tour.  
  - Critère : chaque effet possède une durée et expire correctement.

### Fin et reprise
- **En tant que membre**, je veux savoir quand un personnage est KO afin de terminer le combat.  
  - Critère : la fin du combat est décidée côté serveur.  
  - Critère : l’écran affiche victoire ou défaite.

- **En tant que membre**, je veux reprendre un combat en cours afin de continuer ma partie.  
  - Critère : l’état du combat est chargé depuis la base.  
  - Critère : le tour courant est conservé.

### Journal et historique
- **En tant que membre**, je veux consulter le journal de combat afin de suivre les actions.  
  - Critère : chaque action est ajoutée au journal dans l’ordre des tours.  
  - Critère : le journal est persisté avec le combat.

## Persistance et données

- **En tant que membre**, je veux que mes combats soient sauvegardés afin de ne pas perdre ma progression.  
  - Critère : l’état, le tour et les données de combat sont stockés.

- **En tant que membre**, je veux que mon compte référence mon combat actuel afin de le reprendre rapidement.  
  - Critère : le champ `current_battle` est mis à jour correctement.

## Administrateur

- **En tant qu’administrateur**, je veux accéder au panneau d’administration afin de gérer la plateforme.  
  - Critère : l’accès est restreint au rôle administrateur.

- **En tant qu’administrateur**, je veux bannir ou débannir un utilisateur afin de modérer la communauté.  
  - Critère : un utilisateur banni ne peut plus se connecter.  
  - Critère : le bannissement est réversible.

- **En tant qu’administrateur**, je veux supprimer un utilisateur afin de retirer définitivement son compte.  
  - Critère : le compte est supprimé de la base.  
  - Critère : les combats associés sont traités selon une règle définie (suppression ou archivage).