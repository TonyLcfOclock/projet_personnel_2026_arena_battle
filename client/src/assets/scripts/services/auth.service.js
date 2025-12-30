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