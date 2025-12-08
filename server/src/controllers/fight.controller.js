class Fight {

    initiateCharacters(req, res) {

    }
    
    calculateCharacterHitChance(speed) {
        return Math.floor(Math.random() * speed);
    }

    chooseCharacterHitTurn(req, res) {
        let objs = req.body;
        console.log(objs)
        res.status(200).json();
    }
}

export default Fight;