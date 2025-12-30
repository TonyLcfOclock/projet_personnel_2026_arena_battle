export const authUser = $state({ username: null });

export function setAuth(user) {
    authUser.username = user;
}

export function clearAuth() {
    authUser.username = null;
}