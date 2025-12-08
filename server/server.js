import express from 'express';
import router from './src/routes.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(router);

app.listen(port, () => {
    console.log('Serveur démarré.');
});