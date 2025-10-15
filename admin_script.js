document.addEventListener("DOMContentLoaded", () => {
  // Lấy các phần tử DOM cần thiết
  const productForm = document.getElementById("product-form");
  const productIdInput = document.getElementById("product-id");
  const productNameInput = document.getElementById("product-name");
  const productBrandInput = document.getElementById("product-brand");
  const productPriceInput = document.getElementById("product-price");
  const productImageInput = document.getElementById("product-image");
  const addEditBtn = document.getElementById("add-edit-btn");
  const clearBtn = document.getElementById("clear-btn");
  const productTableBody = document.querySelector("#product-table tbody");

  // Dữ liệu sản phẩm mặc định
  const defaultProducts = [
    {
      id: 1,
      name: "iPhone 15 Pro Max",
      brand: "Apple",
      price: 31000000,
      image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-256gb_1.png",
    },
    {
      id: 2,
      name: "iPhone 14 Pro Max",
      brand: "Apple",
      price: 26000000,
      image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-pro_2__5.png",
    },
    {
      id: 3,
      name: "Samsung Galaxy S24 Ultra",
      brand: "Samsung",
      price: 28000000,
      image: "https://cdn2.cellphones.com.vn/358x/media/catalog/product/g/a/galaxy-s24-ultra-xam_1_3.png",
    },
    {
      id: 4,
      name: "Samsung Galaxy S24",
      brand: "Samsung",
      price: 21000000,
      image: "https://cdn2.cellphones.com.vn/358x/media/catalog/product/g/a/galaxy-s24-xam_3.png",
    },
    {
      id: 5,
      name: "Xiaomi 14 Ultra",
      brand: "Xiaomi",
      price: 23000000,
      image: "https://cdn2.cellphones.com.vn/358x/media/catalog/product/d/i/dien-thoai-oppo-a18-4gb-64gb_16_.png",
    },
    {
      id: 6,
      name: "OPPO Find X7 Ultra",
      brand: "OPPO",
      price: 17000000,
      image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/e/d/eda006276802c_1_1.jpg",
    },
    {
      id: 7,
      name: "Vivo X100 Pro",
      brand: "Vivo",
      price: 21000000,
      image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/d/i/dien-thoai-vivo-x100-pro_1_.png",
    },
    {
      id: 8,
      name: "Realme GT Neo 6 SE",
      brand: "Realme",
      price: 12000000,
      image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/_/e/_e4.jpg",
    },
  ];

  // Load sản phẩm từ localStorage hoặc sử dụng dữ liệu mặc định
  let products = JSON.parse(localStorage.getItem("products"));
  if (!products || products.length === 0) {
    products = defaultProducts;
    localStorage.setItem("products", JSON.stringify(products));
  }

  // Hàm render danh sách sản phẩm
  const renderProducts = () => {
    productTableBody.innerHTML = "";
    products.forEach((product, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>${product.brand}</td>
        <td>${product.price.toLocaleString("vi-VN")} VNĐ</td>
        <td><img src="${product.image}" alt="${product.name}" /></td>
        <td>
          <button class="action-btn edit-btn" data-id="${product.id}">Sửa</button>
          <button class="action-btn delete-btn" data-id="${product.id}">Xóa</button>
        </td>
      `;
      productTableBody.appendChild(row);
    });
  };

  // Hàm lưu sản phẩm vào localStorage
  const saveProducts = () => {
    localStorage.setItem("products", JSON.stringify(products));
  };

  // Hàm reset form
  const resetForm = () => {
    productIdInput.value = "";
    productNameInput.value = "";
    productBrandInput.value = "";
    productPriceInput.value = "";
    productImageInput.value = "";
    addEditBtn.textContent = "Thêm sản phẩm";
  };

  // Xử lý sự kiện submit form
  productForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const id = productIdInput.value;
    const name = productNameInput.value;
    const brand = productBrandInput.value;
    const price = parseInt(productPriceInput.value);
    const image = productImageInput.value;

    if (id) {
      // Sửa sản phẩm
      const productIndex = products.findIndex((p) => p.id === parseInt(id));
      if (productIndex > -1) {
        products[productIndex] = { id: parseInt(id), name, brand, price, image };
      }
    } else {
      // Thêm sản phẩm mới
      const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
      const newProduct = { id: newId, name, brand, price, image };
      products.push(newProduct);
    }

    saveProducts();
    renderProducts();
    resetForm();
  });

  // Xử lý sự kiện click vào nút Sửa hoặc Xóa
  productTableBody.addEventListener("click", (e) => {
    const target = e.target;
    const id = parseInt(target.dataset.id);

    if (target.classList.contains("delete-btn")) {
      // Xóa sản phẩm
      if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
        products = products.filter((p) => p.id !== id);
        saveProducts();
        renderProducts();
      }
    } else if (target.classList.contains("edit-btn")) {
      // Sửa sản phẩm
      const productToEdit = products.find((p) => p.id === id);
      if (productToEdit) {
        productIdInput.value = productToEdit.id;
        productNameInput.value = productToEdit.name;
        productBrandInput.value = productToEdit.brand;
        productPriceInput.value = productToEdit.price;
        productImageInput.value = productToEdit.image;
        addEditBtn.textContent = "Cập nhật";
      }
    }
  });

  // Xử lý nút Xóa Form
  clearBtn.addEventListener("click", resetForm);

  // Render danh sách sản phẩm ban đầu
  renderProducts();
});