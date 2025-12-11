document.addEventListener("DOMContentLoaded", () => {
    // 1. Отримуємо ID з URL (наприклад, product.html?id=5)
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    if (!productId) {
        window.location.href = "index.html"; // Якщо ID немає, кидаємо на головну
        return;
    }

    loadProductDetails(productId);
});

function loadProductDetails(id) {
    const container = document.getElementById("product-detail");

    fetch(`http://localhost:3000/api/products/${id}`)
        .then(res => {
            if (!res.ok) throw new Error("Товар не знайдено");
            return res.json();
        })
        .then(p => {
            const imageSrc = p.ImageURL ? p.ImageURL : '../assets/default-product.jpg';
            const safeName = p.ProductName.replace(/'/g, "&#39;");
            
            // Заповнюємо HTML даними
            container.innerHTML = `
                <div class="detail-image">
                    <img src="${imageSrc}" alt="${p.ProductName}" onerror="this.src='https://via.placeholder.com/400'">
                </div>
                <div class="detail-info">
                    <h1>${p.ProductName}</h1>
                    <p class="detail-price">${p.Price} грн</p>
                    
                    <h3>Опис:</h3>
                    <p class="detail-desc">${p.Description || "Опис відсутній."}</p>
                    
                    <p><b>Категорія ID:</b> ${p.CategoryID}</p>
                    <p><b>В наявності:</b> ${p.Stock} шт.</p>
                    <br>

                    <button class="button button-blue large" 
                        onclick="addToCart(${p.ProductID}, '${safeName}', ${p.Price}, '${imageSrc}')">
                        Додати в кошик
                    </button>
                </div>
            `;
        })
        .catch(err => {
            container.innerHTML = `<h2>❌ Помилка: ${err.message}</h2><br><a href="index.html" class="button button-blue">На головну</a>`;
        });
}