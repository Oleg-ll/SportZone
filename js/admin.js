// js/admin.js

const apiUrl = "http://localhost:3000/api/products";

// === 1. ПЕРЕВІРКА ДОСТУПУ (ADMIN) ===
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) { return null; }
}

function checkAdminAccess() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }
    const user = parseJwt(token);
    // Приводимо до нижнього регістру для надійності
    if (!user || user.role.toLowerCase() !== 'admin') {
        alert("Доступ заборонено! Тільки для адміністраторів.");
        window.location.href = "index.html";
    }
}

// Запускаємо перевірку
checkAdminAccess();

// === 2. ЛОГІКА ВИХОДУ ===
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "login.html";
    });
}

// === 3. ОСНОВНИЙ ФУНКЦІОНАЛ ===
document.addEventListener("DOMContentLoaded", loadProducts);

function loadProducts() {
    // Додаємо timestamp, щоб уникнути кешування
    fetch(apiUrl + '?t=' + new Date().getTime())
        .then(res => res.json())
        .then(data => {
            const table = document.getElementById("productTable");
            table.innerHTML = "";

            data.forEach(p => {
                const row = `
                    <tr>
                        <td>${p.ProductID}</td>
                        <td><img src="${p.ImageURL || "https://via.placeholder.com/80"}"></td>
                        <td>${p.ProductName}</td>
                        <td>${p.Price} грн</td>
                        <td>${p.Stock}</td>
                        <td>${p.CategoryID}</td>
                        <td class="actions">
                            <button class="btn-edit" onclick='openEdit(${JSON.stringify(p)})'>Ред.</button>
                            <button class="btn-delete" onclick="deleteProduct(${p.ProductID})">Вид.</button>
                        </td>
                    </tr>
                `;
                table.innerHTML += row;
            });
        })
        .catch(err => console.error(err));
}

// Додавання товару
const productForm = document.getElementById("productForm");
if (productForm) {
    productForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const product = {
            ProductName: document.getElementById("ProductName").value,
            Description: document.getElementById("Description").value,
            Price: document.getElementById("Price").value,
            Stock: document.getElementById("Stock").value,
            CategoryID: document.getElementById("CategoryID").value,
            ImageURL: document.getElementById("ImageURL").value
        };

        const token = localStorage.getItem("token");

        fetch(apiUrl, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify(product)
        })
        .then(async res => {
            if(!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || "Помилка додавання");
            }
            return res.json();
        })
        .then(() => {
            alert("✅ Товар додано успішно!");
            productForm.reset();
            loadProducts();
        })
        .catch(err => alert("❌ Помилка: " + err.message));
    });
}

// Видалення
window.deleteProduct = function(id) {
    if (!confirm("Ви впевнені, що хочете видалити цей товар?")) return;

    const token = localStorage.getItem("token");

    fetch(`${apiUrl}/${id}`, { 
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    })
    .then(async res => {
        if(!res.ok) {
            const errData = await res.json();
            throw new Error(errData.message || "Помилка видалення");
        }
        return res.json();
    })
    .then(() => {
        alert("🗑️ Товар видалено!");
        loadProducts();
    })
    .catch(err => alert("❌ Помилка: " + err.message));
}

// Редагування
window.openEdit = function(product) {
    document.getElementById("editID").value = product.ProductID;
    document.getElementById("editName").value = product.ProductName;
    document.getElementById("editPrice").value = product.Price;
    document.getElementById("editStock").value = product.Stock;
    document.getElementById("editCategory").value = product.CategoryID;
    document.getElementById("editImage").value = product.ImageURL;
    document.getElementById("editDescription").value = product.Description;

    document.getElementById("editModal").style.display = "flex";
}

window.closeModal = function() {
    document.getElementById("editModal").style.display = "none";
}

window.saveEdit = function() {
    const id = document.getElementById("editID").value;
    const product = {
        ProductName: document.getElementById("editName").value,
        Description: document.getElementById("editDescription").value,
        Price: document.getElementById("editPrice").value,
        Stock: document.getElementById("editStock").value,
        CategoryID: document.getElementById("editCategory").value,
        ImageURL: document.getElementById("editImage").value
    };

    const token = localStorage.getItem("token");

    fetch(`${apiUrl}/${id}`, {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(product)
    })
    .then(async res => {
        if (!res.ok) {
            // Читаємо повідомлення про помилку від сервера
            const errData = await res.json();
            throw new Error(errData.message || "Помилка сервера");
        }
        return res.json();
    })
    .then(() => {
        alert("✅ Зміни збережено!");
        closeModal();
        loadProducts();
    })
    .catch(err => {
        console.error(err);
        // Тепер ви побачите РЕАЛЬНУ причину помилки
        alert("❌ Помилка: " + err.message);
    });
}