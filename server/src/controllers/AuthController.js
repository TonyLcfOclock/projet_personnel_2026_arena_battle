import { User } from '../models/index.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

const COOKIE_NAME = "access_token";
const JWT_SECRET = process.env.JWT_SECRET;

class AuthController {
    async register(req, res) {
        const { username, password } = req.body;

        if (!username || !password) return res.status(500).json({ error: 'Internal Server Error' });
        if (username.length < 3) return res.status(422).json({ error: 'Invalid username format (min. 3 characters)'});
        if (password.length < 8 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[^a-zA-Z0-9]/.test(password)) {
            return res.status(422).json({ error: 'Invalid password format. Please include uppercase, lowercase, a number, and a special character (min. 8 characters)'});
        }

        try {
            const userCheck = await User.findOne({ where: { username } });

            if (userCheck) {
                return res.status(409).json({ error: "Username already taken" });
            }

            const passwordHashed = await argon2.hash(password);

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

        if (!username || !password) return res.status(500).json({ error: 'Internal Server Error' });
        if (username.length < 3) return res.status(422).json({ error: 'Invalid username format (min. 3 characters)'});
        if (password.length < 8 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[^a-zA-Z0-9]/.test(password)) {
            return res.status(422).json({ error: 'Invalid password format. Please include uppercase, lowercase, a number, and a special character (min. 8 characters)'});
        }

        try {
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
                    maxAge: 1000 * 60 * 60
                });

                const { id, currentBattle } = user.dataValues;

                res.status(201).json({ id, username, currentBattle });
            }
        } catch (error) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        
    }

    logout(_req, res) {
        res.clearCookie("access_token", { path: "/" });
        res.sendStatus(204);
    }

    async me(req, res) {
        try {
            const user = await User.findOne({ where: { username: req.username } });

            if (!user) return res.status(401).json({ error: "Not authenticated" });

            const { id, username, currentBattle } = user.dataValues;

            res.json({ id, username, currentBattle });
        } catch (error) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default new AuthController();