export const authUser = $state({ id: null, username: null, currentBattle: null });

export function setAuth(user) {
    authUser.id = user?.id;
    authUser.username = user?.username;
    authUser.currentBattle = user?.currentBattle;
}

export function clearAuth() {
    authUser.id = null;
    authUser.username = null;
    authUser.currentBattle = null;
}