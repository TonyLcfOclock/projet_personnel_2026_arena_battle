export const authUser = $state({ user: null });

export function setAuth(user) {
    authUser.user = user;
}

export function clearAuth() {
    authUser.user = null;
}