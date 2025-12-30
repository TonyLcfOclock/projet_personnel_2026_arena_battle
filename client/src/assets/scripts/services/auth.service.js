import { setAuth } from "../store/auth.svelte.js";

export async function initAuth() {
    try {
        const res = await fetch('/api/auth/me', {
            method: "GET",
            credentials: "include",
            headers: { "Accept": "application/json" }
        });

        if (!res.ok) {
            return setAuth(null);
        }

        const data = await res.json();

        setAuth(data.user);
    } catch (error) {
        setAuth(null);
    }
};

export async function registerUser(credentials) {
    const res = await fetch('/api/auth/register', {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
    });

    const data = await res.json();

    return data;
}