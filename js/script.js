document.addEventListener('DOMContentLoaded', () => {
  const burgerBtn = document.getElementById('burger-btn');
  const mobileDropdown = document.getElementById('mobile-dropdown');

  

  function openMenu() {
    burgerBtn.classList.add('open');
    mobileDropdown.classList.add('open');
    overlay.classList.add('active');
    mobileDropdown.setAttribute('aria-hidden', 'false');
  }

  function closeMenu() {
    burgerBtn.classList.remove('open');
    mobileDropdown.classList.remove('open');
    overlay.classList.remove('active');
    mobileDropdown.setAttribute('aria-hidden', 'true');
  }

  burgerBtn.addEventListener('click', () => {
    if (mobileDropdown.classList.contains('open')) closeMenu();
    else openMenu();
  });

  // закриваємо меню при кліку на overlay
  overlay.addEventListener('click', closeMenu);

  // закриваємо меню при виборі пункту
  mobileDropdown.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // закриваємо меню при натисканні ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
});

fetch("http://localhost:3000/api/products")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("db-products-container");

    data.forEach(p => {
      const div = document.createElement("div");
      div.className = "product-box";

      div.innerHTML = `
        <img src="../assets/default-product.jpg" alt="${p.ProductName}">
        <div class="product-info">
          <h5>${p.ProductName}</h5>
          <p>Ціна: ${p.Price} грн</p>
          <a href="#" class="button button-blue">У кошик</a>
        </div>
      `;

      container.appendChild(div);
    });
  })
  .catch(err => console.error("Помилка:", err));

  const API = "http://localhost:3000/api/products";

function loadHomeProducts() {
    fetch(API)
        .then(res => res.json())
        .then(data => {
            const box = document.getElementById("db-products-container");

            if (!box) return; // якщо це інша сторінка

            box.innerHTML = "";

            data.forEach(p => {
                box.innerHTML += `
                    <div class="product-box">
                        <img src="${p.ImageURL}" alt="${p.ProductName}">
                        <div class="product-info">
                            <h5>${p.ProductName}</h5>
                            <p>Ціна: ${p.Price} грн</p>
                            <a href="#" class="button button-blue">У кошик</a>
                        </div>
                    </div>
                `;
            });
        });
}

loadHomeProducts();
