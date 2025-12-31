import jwt from "jsonwebtoken";

const COOKIE_NAME = "access_token";

class AuthMiddleware {
    requireAuth(req, res, next) {
        const token = req.cookies?.[COOKIE_NAME];

        if (!token) return res.status(401).json({ error: "Not Authenticated" });

        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);

            req.username = payload.username;
            next();
        } catch(error) {
            return res.status(401).json({ error: "Invalid token" });
        }
    }
}

export default new AuthMiddleware();