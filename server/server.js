import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import router from './src/routes.js';

const app = express();
const port = process.env.PORT || 3000;

// CORS Policy
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use(express.static('public'));

app.use(router);

app.listen(port, () => {
    console.log(`Serveur démarré sur le port: ${port}`);
});