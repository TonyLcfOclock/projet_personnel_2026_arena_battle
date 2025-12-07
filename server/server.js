import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.listen(PORT, () => {
    console.log('Serveur démarré.');
});