// js/cart.js

document.addEventListener("DOMContentLoaded", loadCart);

function loadCart() {
    // Зчитуємо дані
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const container = document.getElementById("cart-content");

    // 1. Якщо кошик порожній
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-msg">
                <p>Ваш кошик порожній 🛒</p>
                <br>
                <a href="index.html" class="button button-blue">Перейти до каталогу</a>
            </div>
        `;
        return;
    }

    // 2. Якщо є товари — будуємо таблицю
    let html = `
        <table class="cart-table">
            <thead>
                <tr>
                    <th>Товар</th>
                    <th>Ціна</th>
                    <th>Кількість</th>
                    <th>Сума</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
    `;

    let totalSum = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        totalSum += itemTotal;

        html += `
            <tr>
                <td style="display: flex; align-items: center; gap: 15px;">
                    <img src="${item.image}" class="cart-img" onerror="this.src='https://via.placeholder.com/60'">
                    <span>${item.name}</span>
                </td>
                <td>${item.price} грн</td>
                <td>
                    <button class="qty-btn" onclick="updateQty(${index}, -1)">-</button>
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQty(${index}, 1)">+</button>
                </td>
                <td>${itemTotal} грн</td>
                <td>
                    <button class="remove-btn" onclick="removeItem(${index})">Видалити</button>
                </td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
        
        <div class="cart-summary">
            <p>Загальна сума: <span class="total-price">${totalSum} грн</span></p>
            <br>
            <button class="button button-blue large" onclick="checkout()">Оформити замовлення</button>
        </div>
    `;

    container.innerHTML = html;
}

// === ЗМІНА КІЛЬКОСТІ ===
function updateQty(index, change) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    if (cart[index]) {
        cart[index].quantity += change;
        
        // Якщо кількість стала 0, видаляємо товар
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart(); // Перемальовуємо
}

// === ВИДАЛЕННЯ ТОВАРУ ===
function removeItem(index) {
    if(!confirm("Видалити товар з кошика?")) return;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

// === ОФОРМЛЕННЯ (Імітація) ===
function checkout() {
    const token = localStorage.getItem("token");
    
    // Перевірка на авторизацію (за бажанням)
    if (!token) {
        alert("Будь ласка, увійдіть в акаунт, щоб оформити замовлення!");
        window.location.href = "login.html";
        return;
    }

    alert("✅ Дякуємо за замовлення! Менеджер зв'яжеться з вами найближчим часом.");
    
    // Очищаємо кошик
    localStorage.removeItem("cart");
    
    // Оновлюємо сторінку (вона покаже, що кошик порожній)
    loadCart();
}