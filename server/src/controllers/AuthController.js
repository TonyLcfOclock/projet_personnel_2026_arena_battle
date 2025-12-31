import { User } from '../models/index.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

const COOKIE_NAME = "access_token";
const JWT_SECRET = process.env.JWT_SECRET;

class AuthController {
    async register(req, res) {
        const { username, password } = req.body;

        try {
            const passwordHashed = await argon2.hash(password);

            const userCheck = await User.findOne({ where: { username } });

            if (userCheck) {
                return res.status(409).json({ error: "Username already taken" });
            }

            const user = await User.create({
                username,
                password: passwordHashed,
                currentBattle: null
            });

            return res.status(201).json({ username: user.username  });

        } catch(error) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    
    async login(req, res) {
        const { username, password } = req.body;

        const user = await User.findOne({ where: { username } });

        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        if (await argon2.verify(user.dataValues.password, password)) {
            const token = jwt.sign(
                { username },
                JWT_SECRET,
                { expiresIn: "1h" }
            );

            res.cookie(COOKIE_NAME, token, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                path: "/",
                maxAger: 1000 * 60 * 60
            });

            res.status(201).json({ username, currentBattle: user.dataValues.currentBattle });
        }
    }

    logout(_req, res) {
        res.clearCookie("access_token", { path: "/" });
        res.sendStatus(204);
    }

    async me(req, res) {
        const user = await User.findOne({ where: { username: req.username } });

        if (!user) return res.status(401).json({ error: "Not authenticated" });

        res.json({ username: req.username });
    }
}

export default new AuthController();