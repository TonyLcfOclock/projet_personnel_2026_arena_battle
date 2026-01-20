import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import { doubleCsrf } from 'csrf-csrf';
import router from './src/routes.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use(express.static('public'));

// CORS Policy
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

const {
    generateToken,
    doubleCsrfProtection,
} = doubleCsrf({
    getSecret: () => process.env.CSRF_SECRET,
    cookieName: 'csrfToken',
    cookieOptions: {
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    }
});

// CSRF getter
app.get('/api/csrf', (req, res) => {
    const csrfToken = generateToken(req, res);
    res.json({ csrfToken });
});

// CSRF middleware
app.use(doubleCsrfProtection);

app.use(router);

app.listen(port, () => {
    console.log(`Serveur démarré sur le port: ${port}`);
});