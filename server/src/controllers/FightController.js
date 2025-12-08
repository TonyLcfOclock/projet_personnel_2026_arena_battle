class FightController {

    static initiateBattle(req, res) {

    }
    
    calculateCharacterHitChance(speed) {
        return Math.floor(Math.random() * speed);
    }

    static chooseCharacterHitTurn(req, res) {
        let objs = req.body;
        console.log(objs)
        res.status(200).json();
    }
}

export default FightController;