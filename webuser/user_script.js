const cartIcon = document.getElementById("cart-icon");
const cartModal = document.getElementById("cart-modal");
const closeBtn = document.querySelector(".close");
const cartCount = document.getElementById("cart-count");
const cartItemsContainer = document.getElementById("cart-items");
const totalPriceEl = document.getElementById("total-price");

let cart = [];

// ====== THÊM VÀO GIỎ ======
document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.id;
    const name = btn.dataset.name;
    const price = parseInt(btn.dataset.price);

    const item = cart.find((p) => p.id === id);
    if (item) item.quantity++;
    else cart.push({ id, name, price, quantity: 1 });

    updateCart();
    alert("✅ Đã thêm vào giỏ hàng thành công!");
  });
});

// ====== MỞ / ĐÓNG GIỎ HÀNG ======
cartIcon.addEventListener("click", () => (cartModal.style.display = "block"));
closeBtn.addEventListener("click", () => (cartModal.style.display = "none"));
window.addEventListener("click", (e) => {
  if (e.target === cartModal) cartModal.style.display = "none";
});

// ====== CẬP NHẬT GIỎ ======
function updateCart() {
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <span>${item.name} x${item.quantity}</span>
      <span>${(item.price * item.quantity).toLocaleString()} VNĐ</span>`;
    cartItemsContainer.appendChild(div);
    total += item.price * item.quantity;
  });

  totalPriceEl.textContent = total.toLocaleString() + " VNĐ";
}

// THANH TOÁN
document.getElementById("checkout-btn").addEventListener("click", () => {
  if (cart.length === 0) alert("Giỏ hàng đang trống!");
  else {
    alert("Thanh toán thành công! 🎉");
    cart = [];
    updateCart();
    cartModal.style.display = "none";
  }
});

//LỌC THEO THƯƠNG HIỆU
const filterLinks = document.querySelectorAll("#brand-filter a");
const productCards = document.querySelectorAll(".product-card");

filterLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    filterLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");

    const brand = link.dataset.brand;
    productCards.forEach((card) => {
      if (brand === "all" || card.dataset.brand === brand)
        card.style.display = "block";
      else card.style.display = "none";
    });
  });
});
