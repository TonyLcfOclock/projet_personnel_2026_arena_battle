import express from 'express';

class Test {
    name = "Verso";
    statistics = {
        HP: 100,
        STR: 50,
        ARM: 50
    };
}

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/api/toPlay/', (req, res) => {
    let array = req.body;

    res.status(200).json(array[0] > array[1]);
})

app.get('/api/characters', (req, res) => {
    const test = new Test();

    res.status(200).json(test);
})

app.post('/api/characters/hp', (req, res) => {
    const player = req.body;

    player.statistics.HP -= 20;

    res.status(200).json(player)
})

app.listen(port, () => {
    console.log('Serveur démarré.');
});