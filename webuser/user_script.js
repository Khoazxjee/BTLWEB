document.addEventListener("DOMContentLoaded", () => {
  // Products data
  const products = [
    {
      id: 0,
      name: "The Dark Side of the Moon",
      artist: "Pink Floyd",
      price: 550000,
      image:
        "https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png",
    },
    {
      id: 1,
      name: "Abbey Road",
      artist: "The Beatles",
      price: 480000,
      image: "https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg",
    },
    {
      id: 2,
      name: "Thriller",
      artist: "Michael Jackson",
      price: 450000,
      image:
        "https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png",
    },
    {
      id: 3,
      name: "Rumours",
      artist: "Fleetwood Mac",
      price: 420000,
      image: "https://upload.wikimedia.org/wikipedia/en/f/fb/FMacRumours.PNG",
    },
    {
      id: 4,
      name: "Led Zeppelin IV",
      artist: "Led Zeppelin",
      price: 520000,
      image:
        "https://upload.wikimedia.org/wikipedia/en/2/26/Led_Zeppelin_-_Led_Zeppelin_IV.jpg",
    },
    {
      id: 5,
      name: "Random Access Memories",
      artist: "Daft Punk",
      price: 600000,
      image:
        "https://upload.wikimedia.org/wikipedia/en/a/a4/Random_Access_Memories.jpg",
    },
    {
      id: 6,
      name: "21",
      artist: "Adele",
      price: 350000,
      image: "https://upload.wikimedia.org/wikipedia/en/1/1b/Adele_-_21.png",
    },
    {
      id: 7,
      name: "Nevermind",
      artist: "Nirvana",
      price: 500000,
      image:
        "https://upload.wikimedia.org/wikipedia/en/b/b7/NirvanaNevermindalbumcover.jpg",
    },
  ];

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // DOM elements
  const productSlider = document.getElementById("productList");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const cartIcon = document.getElementById("cart-icon");
  const cartCount = document.getElementById("cart-count");
  const cartModal = document.getElementById("cart-modal");
  const closeCartBtn = document.querySelector("#cart-modal .close-btn");
  const checkoutBtn = document.getElementById("checkout-btn");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalSpan = document.getElementById("cart-total");

  // Checkout modal elements
  const checkoutModal = document.getElementById("checkout-modal");
  const closeCheckoutBtn = document.querySelector("#checkout-modal .close-btn");
  const checkoutForm = document.getElementById("checkout-form");

  // Format currency
  const formatCurrency = (number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(number);
  };

  // Update cart display
  const updateCart = () => {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML =
        '<p class="cart-empty-message">Giỏ hàng trống.</p>';
    } else {
      cart.forEach((item) => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("cart-item");
        cartItemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" />
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p class="price">${formatCurrency(item.price)}</p>
                    <div class="item-quantity">
                        <button class="decrease-btn" data-id="${
                          item.id
                        }">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase-btn" data-id="${
                          item.id
                        }">+</button>
                        <button class="remove-btn" data-id="${item.id}">
                            &times;
                        </button>
                    </div>
                </div>
            `;
        cartItemsContainer.appendChild(cartItemElement);
        total += item.price * item.quantity;
      });
    }

    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartTotalSpan.textContent = formatCurrency(total);
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  // Add product to cart
  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    updateCart();
    // Vibrate the cart icon for visual feedback
    cartIcon.classList.add('vibrate');
    setTimeout(() => {
        cartIcon.classList.remove('vibrate');
    }, 500);
  };

  // Handle quantity changes in cart
  const handleCartActions = (e) => {
    const target = e.target;
    const productId = parseInt(target.dataset.id);
    const product = cart.find((item) => item.id === productId);

    if (!product) return;

    if (target.classList.contains("increase-btn")) {
      product.quantity++;
    } else if (target.classList.contains("decrease-btn")) {
      product.quantity--;
      if (product.quantity === 0) {
        cart = cart.filter((item) => item.id !== productId);
      }
    } else if (target.classList.contains("remove-btn")) {
      cart = cart.filter((item) => item.id !== productId);
    }

    updateCart();
  };

  // Attach event listeners
  const init = () => {
    // Add to cart buttons
    document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const productIndex = parseInt(button.dataset.productIndex);
        const productToAdd = products[productIndex];
        addToCart(productToAdd);
      });
    });

    // Cart icon click to open modal
    cartIcon.addEventListener("click", () => {
      cartModal.style.display = "block";
      updateCart();
    });

    // Close cart modal button
    closeCartBtn.addEventListener("click", () => {
      cartModal.style.display = "none";
    });

    // Open checkout modal when "Thanh toán" is clicked
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Giỏ hàng của bạn đang trống!");
        return;
      }
      cartModal.style.display = "none";
      checkoutModal.style.display = "block";
    });

    // Close checkout modal button
    closeCheckoutBtn.addEventListener("click", () => {
      checkoutModal.style.display = "none";
    });

    // Close modal when clicking outside
    window.addEventListener("click", (e) => {
      if (e.target === cartModal) {
        cartModal.style.display = "none";
      }
      if (e.target === checkoutModal) {
        checkoutModal.style.display = "none";
      }
    });

    // Handle quantity/remove buttons in modal
    cartItemsContainer.addEventListener("click", handleCartActions);

    // Handle checkout form submission
    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();
      // In a real-world scenario, you would send this data to a server.
      const formData = new FormData(checkoutForm);
      const name = formData.get("name");
      const phone = formData.get("phone");
      const address = formData.get("address");

      // Here you can process the order information, e.g., send it to an API
      console.log("Đơn hàng đã được tạo:");
      console.log("Họ và tên:", name);
      console.log("Số điện thoại:", phone);
      console.log("Địa chỉ:", address);
      console.log("Sản phẩm:", cart);

      // Show success message
      alert("Đặt hàng thành công! Cảm ơn bạn đã mua hàng.");

      // Clear the cart and close modals
      cart = [];
      updateCart();
      checkoutModal.style.display = "none";
      cartModal.style.display = "none";
      checkoutForm.reset();
    });

    // Initial load
    updateCart();
  };

  // Slider functionality (from your original code)
  let currentIndex = 0;
  const cardWidth = 305; // 25% of 1200px + gap (300 + 25)
  const totalProducts = products.length;
  const cardsPerPage = 4;
  const maxIndex = totalProducts - cardsPerPage;

  function updateSlider() {
    productSlider.style.transform = `translateX(-${
      currentIndex * cardWidth
    }px)`;
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= maxIndex;
  }

  prevBtn.addEventListener("click", () => {
    currentIndex = Math.max(0, currentIndex - 1);
    updateSlider();
  });

  nextBtn.addEventListener("click", () => {
    currentIndex = Math.min(maxIndex, currentIndex + 1);
    updateSlider();
  });

  init();
  updateSlider();
});