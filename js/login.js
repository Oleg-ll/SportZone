document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const msg = document.getElementById("loginMessage");

    try {
        const res = await fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            msg.textContent = "❌ " + data.message;
            msg.style.color = "red";
            return;
        }

        msg.textContent = "✅ Успішний вхід!";
        msg.style.color = "green";

        // зберігаємо токен
        localStorage.setItem("token", data.token);

        setTimeout(() => window.location.href = "index.html", 1200);

    } catch (error) {
        msg.textContent = "❌ Помилка сервера";
        msg.style.color = "red";
    }
});
