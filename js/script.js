document.addEventListener('DOMContentLoaded', () => {
    
    const burgerBtn = document.getElementById('burger-btn');
    const mobileDropdown = document.getElementById('mobile-dropdown');
    
    // Перевіряємо наявність оверлею 
    const overlay = document.querySelector('.overlay') || document.createElement('div'); 

    function openMenu() {
        burgerBtn.classList.add('open');
        mobileDropdown.classList.add('open');
        if(overlay.parentElement) overlay.classList.add('active'); 
        mobileDropdown.setAttribute('aria-hidden', 'false');
    }

    function closeMenu() {
        burgerBtn.classList.remove('open');
        mobileDropdown.classList.remove('open');
        if(overlay.parentElement) overlay.classList.remove('active');
        mobileDropdown.setAttribute('aria-hidden', 'true');
    }

    if (burgerBtn) {
        burgerBtn.addEventListener('click', () => {
            if (mobileDropdown.classList.contains('open')) closeMenu();
            else openMenu();
        });
    }

    if (overlay.parentElement) overlay.addEventListener('click', closeMenu);

    if (mobileDropdown) {
        mobileDropdown.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeMenu();
    });

    // === 2. ЗАВАНТАЖЕННЯ ТОВАРІВ (ГОЛОВНА) ===
    loadHomeProducts();

    // === 3. ПЕРЕВІРКА АВТОРИЗАЦІЇ І РОЛІ ===
    checkAuthStatus();
});

// === ФУНКЦІЯ ЗАВАНТАЖЕННЯ ТОВАРІВ ===
function loadHomeProducts() {
    const API = "http://localhost:3000/api/products";
    const box = document.getElementById("db-products-container");

    if (!box) return; // Якщо ми не на головній, виходимо

    fetch(API)
        .then(res => res.json())
        .then(data => {
            box.innerHTML = "";
            data.forEach(p => {
                // Заглушка для картинки
                const imageSrc = p.ImageURL ? p.ImageURL : '../assets/default-product.jpg';
                
                // Екрануємо лапки для безпеки JS
                const safeName = p.ProductName.replace(/'/g, "&#39;").replace(/"/g, "&quot;");

                // === ГОЛОВНА ЗМІНА ТУТ ===
                // Ми додали тег <a> навколо картинки та назви
                box.innerHTML += `
                    <div class="product-box">
                        <a href="product.html?id=${p.ProductID}" style="text-decoration: none; color: inherit; display: block;">
                            <img src="${imageSrc}" alt="${p.ProductName}" onerror="this.src='https://via.placeholder.com/200?text=No+Image'">
                        </a>

                        <div class="product-info">
                            <h5>
                                <a href="product.html?id=${p.ProductID}" style="text-decoration: none; color: inherit;">
                                    ${p.ProductName}
                                </a>
                            </h5>
                            <p>Ціна: ${p.Price} грн</p>
                            
                            <button class="button button-blue" 
                                onclick="addToCart(${p.ProductID}, '${safeName}', ${p.Price}, '${imageSrc}')">
                                У кошик
                            </button>
                        </div>
                    </div>
                `;
            });
        })
        .catch(err => console.error("Помилка завантаження товарів:", err));
}

// === ФУНКЦІЯ ДОДАВАННЯ В КОШИК (localStorage) ===
function addToCart(id, name, price, image) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Блокуємо спливання події (щоб клік по кнопці не вважався кліком по картці)
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }

    const existingProduct = cart.find(item => item.id === id);

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({ id, name, price, image, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`Товар "${name}" додано до кошика!`);
}

// === ДОПОМІЖНІ ФУНКЦІЇ АВТОРИЗАЦІЇ ===
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

function checkAuthStatus() {
    const token = localStorage.getItem("token");
    const headerActions = document.querySelector(".header-actions");

    if (token && headerActions) {
        const user = parseJwt(token);
        
        let htmlButtons = `
            <a href="user.html" class="button button-blue">👤 Профіль</a>
        `;

        if (user && user.role === 'admin') {
            htmlButtons += `
                <a href="admin.html" class="button" style="background-color: #d9534f; color: white; border: none; margin-left: 5px;">⚙ Адмін</a>
            `;
        }

        htmlButtons += `
            <a href="cart.html" class="button button-dark-outline">🛒 Кошик</a>
        `;

        headerActions.innerHTML = htmlButtons;
    } 
}