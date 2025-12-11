document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    // 1. Перевірка: якщо токена немає — викидаємо на вхід
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    // 2. Функція для розшифровки токена (підтримує кирилицю)
    function parseJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        } catch (e) {
            return null;
        }
    }

    // 3. Отримуємо дані
    const userData = parseJwt(token);

    if (userData) {
        // Вставляємо ім'я
        const nameElement = document.getElementById("userName");
        if (nameElement) nameElement.textContent = userData.username;

        // Вставляємо email
        const emailElement = document.getElementById("userEmail");
        if (emailElement) emailElement.textContent = userData.email;
    }

    // 4. Логіка кнопки "Вийти"
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("token");
            window.location.href = "index.html";
        });
    }
});