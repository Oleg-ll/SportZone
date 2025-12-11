document.getElementById("registerForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const password2 = document.getElementById("password2").value;

    const msg = document.getElementById("registerMessage");

    if (password !== password2) {
        msg.textContent = "❌ Паролі не співпадають!";
        msg.style.color = "red";
        return;
    }

    const userData = { username, email, password };

    try {
        // Змінили /api/ на /auth/
const res = await fetch("http://localhost:3000/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });

        const data = await res.json();

        if (!res.ok) {
            msg.textContent = "❌ " + data.message;
            msg.style.color = "red";
            return;
        }

        msg.textContent = "✅ Реєстрація успішна!";
        msg.style.color = "green";

        setTimeout(() => window.location.href = "login.html", 1500);

    } catch (error) {
        msg.textContent = "❌ Помилка з'єднання з сервером";
        msg.style.color = "red";
    }
});
