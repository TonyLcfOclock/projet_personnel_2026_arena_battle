export async function getCsrfToken() {
    const res = await fetch('/api/csrf', {
        method: "GET",
        credentials: "include",
        headers: { "Accept": "application/json" }
    });

    const csrfToken = await res.json();

    return csrfToken;
};

export async function storeCsrfToken() {
    const { csrfToken } = await getCsrfToken();

    localStorage.setItem('csrfToken', csrfToken);
}