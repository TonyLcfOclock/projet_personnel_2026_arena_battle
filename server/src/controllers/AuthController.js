import { User } from '../models/index.js';
import argon2 from 'argon2';

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
}

export default new AuthController();