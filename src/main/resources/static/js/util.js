function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-ZA", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-ZA", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

function getToken() {
    return localStorage.getItem("token");
}

function getRole() {
    return localStorage.getItem("userRole");
}

function isLoggedIn() {
    return !!localStorage.getItem("token");
}

function clearSession() {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
}