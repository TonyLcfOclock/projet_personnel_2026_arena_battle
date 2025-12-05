class Utilities {
    static sleep (ms){
        new Promise(res => setTimeout(res, ms));
    }

    static choseRandomMonster(object) {
        let monsterList = [];

        for (let key in object) {
            let objects = object[key];
            monsterList.push(objects)
        }

        const randomIndex = Math.floor(Math.random() * monsterList.length);
        const randomMonster = monsterList[randomIndex];

        return randomMonster;
    }

    static choseRandomHero(object) {
        let heroList = [];

        for (let key in object) {
            let objects = object[key];
            heroList.push(objects)
        }

        const randomIndex = Math.floor(Math.random() * heroList.length);
        const randomHero = heroList[randomIndex];

        return randomHero;
    }

    static getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
}

export default Utilities;