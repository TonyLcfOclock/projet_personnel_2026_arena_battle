class Utilities {
    static sleep = (ms) => new Promise(res => setTimeout(res, ms));

    static initiateCharacters() {
        const res = await fetch('/api/init')
    }

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

    static checkSpellIsOnCooldown(spells, charSpells) {
        const spell = charSpells.find(element => {
            return element.name === spells.name
        })

        return spell.currentCooldown > 0;
    }
}

export default Utilities;