class Utilities {
    static sleep = (ms) => new Promise(res => setTimeout(res, ms));

    static async initiateCharacters() {
        const res = await fetch('/api/init');

        const characters = await res.json()

        return characters;
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

    static initiatePassives(character) {
        let passives = character.passives.filter(element => element.display === true);

        return passives;
    }

    static initiateBuffs(character) {
        let buffs = character.buffs.filter(element => element.state === true);

        return buffs;
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