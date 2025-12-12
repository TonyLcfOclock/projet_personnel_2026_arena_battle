class Utilities {
    static sleep = (ms) => new Promise(res => setTimeout(res, ms));

    static initiatePlayerSpells(player) {
        let playerSpellsList = player.spells.map((element) => {
            return {
                name: element.name,
                image: element.image,
                description: element.description,
            };
        });

        return playerSpellsList;
    }

    static initiateCharacterImage(char) {
        return char.image;
    }

}

export default Utilities;