import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/characters', (req, res) => {
    const test = {
        name: "Verso",
        statistics: {
            HP: 100,
            STR: 50,
            ARM: 50
        }
    }

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