import { prisma } from "../models/index.ts";
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import type { Request, Response } from 'express';
import type { parsedAuthSchema, RequestAuth } from '../types.ts';
import { requireEnv } from '../config/env.ts';
import { z } from 'zod';
import { ConflictError, UnauthorizedError, UnexpectedServerError } from "../scripts/utils/Error.ts";
import ErrorHandler from "../scripts/ErrorHandler.ts";

const COOKIE_NAME = "access_token";

const AuthSchema = z.object({
    username: z.string().min(3, "Invalid username format (min. 3 characters)"),
    password: z
        .string()
        .min(8, "Invalid password format (min. 8 characters)")
        .refine(
            (v) =>
            /[a-z]/.test(v) &&
            /[A-Z]/.test(v) &&
            /[0-9]/.test(v) &&
            /[^a-zA-Z0-9]/.test(v),
        "Invalid password format. Please include uppercase, lowercase, a number, and a special character (min. 8 characters)"
    ),
});

class AuthController {
    async register(req: Request, res: Response) {
        try {
            const parsedAuth = AuthSchema.safeParse(req.body);

            if (!parsedAuth.data) {
                return ErrorHandler.sendError(res, parsedAuth.error);
            };

            const { username, password } = parsedAuth.data as parsedAuthSchema;

            const userCheck = await prisma.user.findUnique({ where: { username } });

            if (userCheck) {
                throw new ConflictError("Username already taken");
            };

            const passwordHashed = await argon2.hash(password);

            const user = await prisma.user.create({
                data: {
                    username,
                    password: passwordHashed,
                }
            });

            return res.status(201).json({ username: user.username  });

        } catch(error) {
            ErrorHandler.sendError(res, error);
        };
    };
    
    async login(req: Request, res: Response) {
        try {
            const parsedAuth = AuthSchema.safeParse(req.body);

            if (!parsedAuth.data) {
                return ErrorHandler.sendError(res, parsedAuth.error);
            };

            const { username, password } = parsedAuth.data as parsedAuthSchema;
            
            const user = await prisma.user.findUnique({ where: { username } });

            if (!user) throw new UnauthorizedError("Invalid credentials");

            if (await argon2.verify(user.password, password)) {
                const token = jwt.sign(
                    { username },
                    requireEnv("JWT_SECRET"),
                    { expiresIn: "1h" }
                );

                res.cookie(COOKIE_NAME, token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    path: "/",
                    maxAge: 1000 * 60 * 60
                });

                const { id, currentBattle } = user;

                return res.status(201).json({ id, username, currentBattle });
            };

            throw new UnauthorizedError("Invalid credentials");
        } catch (error) {
            ErrorHandler.sendError(res, error);
        };
    };

    logout(_req: Request, res: Response) {
        res.clearCookie("access_token", { path: "/" });
        res.sendStatus(204);
    };

    async me(req: RequestAuth, res: Response) {
        try {
            if (!req.username) throw new UnexpectedServerError("Username needed");

            const user = await prisma.user.findUnique({ where: { username: req.username } });

            if (!user) throw new UnauthorizedError("Not authenticated");

            const { id, username, currentBattle } = user;

            res.send({ id, username, currentBattle });
        } catch (error) {
            ErrorHandler.sendError(res, error);
        };
    };
};

export default new AuthController();