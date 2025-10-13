// Dữ liệu giả lập (Mô phỏng Database)
let recordsData = [
    { id: 'REC001', album: 'The Dark Side of the Moon', artist: 'Pink Floyd', genre: 'Rock', price: 650000, stock: 50, img: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png' },
    { id: 'REC002', album: 'Abbey Road', artist: 'The Beatles', genre: 'Rock', price: 600000, stock: 80, img: 'https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg' },
    { id: 'REC003', album: 'Thriller', artist: 'Michael Jackson', genre: 'Pop', price: 480000, stock: 120, img: 'https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png' },
    { id: 'REC004', album: 'Kind of Blue', artist: 'Miles Davis', genre: 'Jazz', price: 720000, stock: 35, img: 'https://upload.wikimedia.org/wikipedia/en/9/9c/Kind_of_Blue_%28Miles_Davis%29.jpg' },
    { id: 'REC005', album: '21', artist: 'Adele', genre: 'Pop', price: 450000, stock: 9, img: 'https://upload.wikimedia.org/wikipedia/en/1/1b/Adele_-_21.png' },
];

let ordersData = [
    { id: 'ORD001', customer: 'Nguyễn Văn A', date: '2025-05-10', total: 1900000, status: 'Đã Giao', items: [{id: 'REC001', qty: 1}, {id: 'REC003', qty: 2}] },
    { id: 'ORD002', customer: 'Trần Thị B', date: '2025-05-11', total: 650000, status: 'Chưa Giao', items: [{id: 'REC001', qty: 1}] },
    { id: 'ORD003', customer: 'Lê Văn C', date: '2025-05-12', total: 2400000, status: 'Đã Giao', items: [{id: 'REC002', qty: 4}] },
    { id: 'ORD004', customer: 'Phạm Thu D', date: '2025-05-12', total: 720000, status: 'Đã Hủy', items: [{id: 'REC004', qty: 1}] },
];

// --- UTILITY FUNCTIONS ---
const formatCurrency = (amount) => {
    // Sử dụng mã VND chuẩn ISO 4217
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

function showCustomAlert(title, message) {
    document.getElementById('alert-title').textContent = title;
    document.getElementById('alert-message').textContent = message;
    document.getElementById('custom-alert-modal').style.display = 'flex';
}

function closeModal(modalId) {
    // Đóng modal bằng cách đặt display về none
    document.getElementById(modalId).style.display = 'none';
}

// --- 1. LOGIC ỨNG DỤNG ĐƠN TRANG (SPA Simulation) ---
const appContent = document.getElementById('app-content');
const currentViewTitle = document.getElementById('current-view-title');
const navLinks = document.querySelectorAll('.nav-link');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebar-overlay');
const menuToggle = document.getElementById('menu-toggle');

const views = {
    'dashboard': { title: 'Tổng Quan Hệ Thống', content: () => createDashboardView() },
    'records': { title: 'Quản Lý Đĩa Nhạc', content: () => createRecordsView() },
    'orders': { title: 'Quản Lý Đơn Hàng', content: () => createOrdersView() }
};

function loadView(viewName) {
    const view = views[viewName];
    if (!view) return;

    currentViewTitle.textContent = view.title;
    appContent.innerHTML = view.content();
    
    // Cập nhật trạng thái Active trên Sidebar (Sử dụng class 'active' mới)
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-view') === viewName) {
            link.classList.add('active');
        }
    });

    if (sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        overlay.classList.add('hidden-md');
    }
    
    // Gắn listeners sau khi View Records được render
    if (viewName === 'records') {
        attachRecordsViewListeners();
    }
}

// Gắn sự kiện chuyển View cho các liên kết Sidebar
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const viewName = link.getAttribute('data-view');
        loadView(viewName);
    });
});

// Logic Mobile Sidebar
menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('hidden-md');
});

overlay.addEventListener('click', () => {
    closeModal('sidebar-overlay');
    sidebar.classList.remove('open');
});

// --- 2. CÁC HÀM TẠO NỘI DUNG VIEW ---

function createDashboardView() {
    const totalStock = recordsData.reduce((sum, record) => sum + record.stock, 0);
    const totalRevenue = ordersData.filter(o => o.status === 'Đã Giao').reduce((sum, order) => sum + order.total, 0);
    const today = '2025-05-12'; // Giả lập ngày hiện tại
    const todayOrders = ordersData.filter(o => o.date === today && o.status !== 'Đã Hủy').length; 
    const lowStockCount = recordsData.filter(r => r.stock <= 10).length;

    const statCards = [
        { title: 'Tổng Số Đĩa Trong Kho', value: totalStock, icon: 'M4 7v10h16V7H4zm0 0l8 5 8-5', color: 'indigo' },
        { title: 'Doanh Thu Đã Giao (Tháng)', value: formatCurrency(totalRevenue), icon: 'M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 0v-4m0 8v4m-4-4H4m8 0h4', color: 'green' },
        { title: 'Đơn Hàng Mới (Hôm nay)', value: todayOrders, icon: 'M13 7l-5 5-2-2m0 8h12', color: 'yellow' },
        { title: 'Sắp Hết Hàng (<=10)', value: lowStockCount, icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.3 16c-.77 1.333.192 3 1.732 3z', color: 'red' },
    ];

    return `
        <h1 class="page-title">Bảng Tổng Quan Quản Lý</h1>
        
        <!-- Stat Cards -->
        <div class="card-grid">
            ${statCards.map(card => `
                <div class="card" style="--card-border-color: var(--color-${card.color});">
                    <div class="flex-items-center">
                        <div class="icon-wrapper icon-${card.color}">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${card.icon}"></path></svg>
                        </div>
                        <div>
                            <p class="card-stat-title">${card.title}</p>
                            <p class="card-stat-value">${card.value}</p>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>

        <!-- Low Stock Alert -->
        ${lowStockCount > 0 ? `
            <div class="alert alert-red">
                <p class="alert-header">Cảnh báo tồn kho!</p>
                <p>Có ${lowStockCount} đĩa nhạc đang có số lượng tồn kho thấp (dưới 10). Vui lòng kiểm tra mục Quản Lý Đĩa Nhạc.</p>
            </div>
        ` : ''}

        <!-- Simulated Charts Area -->
        <div class="card">
            <h3 class="card-section-title">Thống kê Đơn Hàng Mới (5 ngày gần nhất)</h3>
            <div class="chart-container">
                <!-- Biểu đồ cột giả lập -->
                <div class="chart-bar" style="height: 60%;"><span class="chart-label-top">6</span><span class="chart-label-bottom">T5/8</span></div>
                <div class="chart-bar" style="height: 80%;"><span class="chart-label-top">8</span><span class="chart-label-bottom">T5/9</span></div>
                <div class="chart-bar" style="height: 70%;"><span class="chart-label-top">7</span><span class="chart-label-bottom">T5/10</span></div>
                <div class="chart-bar" style="height: 100%;"><span class="chart-label-top">10</span><span class="chart-label-bottom">T5/11</span></div>
                <div class="chart-bar" style="height: 40%;"><span class="chart-label-top">4</span><span class="chart-label-bottom">Hôm nay</span></div>
            </div>
            <p class="chart-caption">Số lượng đơn hàng mỗi ngày (Giả định)</p>
        </div>
    `;
}

function createRecordsView(data = recordsData) {
    return `
        <div class="page-header">
            <h1 class="page-title">Quản Lý Đĩa Nhạc (${data.length} mục)</h1>
            <button onclick="openRecordModal('add')" class="btn btn-primary btn-icon">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                Thêm Đĩa Mới
            </button>
        </div>

        <!-- Filter & Search Bar -->
        <div class="card filter-bar">
            <input type="text" id="record-search" placeholder="Tìm kiếm theo Album / Nghệ Sĩ..." class="form-input search-input">
            <select id="record-filter-genre" class="form-input filter-select">
                <option value="">Lọc theo Thể Loại</option>
                <option value="Pop">Pop</option>
                <option value="Rock">Rock</option>
                <option value="Jazz">Jazz</option>
                <option value="Classical">Classical</option>
                <option value="Hip Hop">Hip Hop</option>
            </select>
        </div>

        <!-- Records Table -->
        <div class="table-wrapper">
            <table class="data-table">
                <thead>
                    <tr>
                        <th class="table-header">Ảnh</th>
                        <th class="table-header">Mã Đĩa</th>
                        <th class="table-header">Tên Album & Nghệ Sĩ</th>
                        <th class="table-header">Giá Bán</th>
                        <th class="table-header">Tồn Kho</th>
                        <th class="table-header text-right">Thao Tác</th>
                    </tr>
                </thead>
                <tbody id="records-table-body">
                    ${data.length > 0 ? data.map(record => `
                        <tr>
                            <td class="table-cell"><img class="record-avatar" src="${record.img}" alt="Ảnh bìa" onerror="this.onerror=null;this.src='https://placehold.co/64x64/3730a3/ffffff?text=CD'"></td>
                            <td class="table-cell">${record.id}</td>
                            <td class="table-cell">
                                <div class="font-medium">${record.album}</div>
                                <div class="text-sm-light">${record.artist} (${record.genre})</div>
                            </td>
                            <td class="table-cell price-text">${formatCurrency(record.price)}</td>
                            <td class="table-cell ${record.stock <= 10 ? 'stock-low' : 'stock-normal'}">${record.stock}</td>
                            <td class="table-cell text-right">
                                <button onclick="openRecordModal('edit', '${record.id}')" class="btn-link btn-edit">Sửa</button>
                                <button onclick="deleteRecord('${record.id}')" class="btn-link btn-delete">Xóa</button>
                            </td>
                        </tr>
                    `).join('') : `
                        <tr><td colspan="6" class="table-empty-message">Không tìm thấy đĩa nhạc nào.</td></tr>
                    `}
                </tbody>
            </table>
        </div>
    `;
}

function createOrdersView() {
    return `
        <h1 class="page-title">Quản Lý Đơn Hàng (${ordersData.length} đơn)</h1>

        <!-- Orders Table -->
        <div class="table-wrapper">
            <table class="data-table">
                <thead>
                    <tr>
                        <th class="table-header">Mã Đơn</th>
                        <th class="table-header">Khách Hàng</th>
                        <th class="table-header">Ngày Đặt</th>
                        <th class="table-header">Tổng Giá Trị</th>
                        <th class="table-header">Trạng Thái</th>
                        <th class="table-header text-right">Chi Tiết</th>
                    </tr>
                </thead>
                <tbody>
                    ${ordersData.map(order => {
                        let statusClass;
                        if (order.status === 'Đã Giao') statusClass = 'status-green';
                        else if (order.status === 'Chưa Giao') statusClass = 'status-yellow';
                        else statusClass = 'status-red';

                        return `
                            <tr>
                                <td class="table-cell order-id">${order.id}</td>
                                <td class="table-cell">${order.customer}</td>
                                <td class="table-cell">${order.date}</td>
                                <td class="table-cell price-text">${formatCurrency(order.total)}</td>
                                <td class="table-cell">
                                    <span class="status-badge ${statusClass}">
                                        ${order.status}
                                    </span>
                                </td>
                                <td class="table-cell text-right">
                                    <button onclick="showOrderDetails('${order.id}')" class="btn-link btn-edit">Xem</button>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// --- 3. LOGIC THAO TÁC DỮ LIỆU (CRUD Giả Lập) ---

let isEditing = false;
let currentRecordId = null;

function openRecordModal(mode, id = null) {
    const modal = document.getElementById('record-modal');
    const modalTitle = document.getElementById('modal-title');
    const form = document.getElementById('record-form');
    form.reset(); // Reset form trước khi mở

    if (mode === 'add') {
        isEditing = false;
        currentRecordId = null;
        modalTitle.textContent = 'Thêm Đĩa Nhạc Mới';
    } else if (mode === 'edit' && id) {
        isEditing = true;
        currentRecordId = id;
        modalTitle.textContent = 'Chỉnh Sửa Đĩa Nhạc';
        const record = recordsData.find(r => r.id === id);
        if (record) {
            document.getElementById('album-name').value = record.album;
            document.getElementById('artist-name').value = record.artist;
            document.getElementById('genre').value = record.genre;
            document.getElementById('price').value = record.price;
            document.getElementById('stock').value = record.stock;
            document.getElementById('img-url').value = record.img;
        }
    }
    modal.style.display = 'flex';
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    // Lấy dữ liệu từ Form
    const album = document.getElementById('album-name').value;
    const artist = document.getElementById('artist-name').value;
    const genre = document.getElementById('genre').value;
    const price = parseInt(document.getElementById('price').value);
    const stock = parseInt(document.getElementById('stock').value);
    const img = document.getElementById('img-url').value || `https://placehold.co/64x64/3730a3/ffffff?text=${album.substring(0,1)}`;

    if (isEditing) {
        // Logic SỬA
        const index = recordsData.findIndex(r => r.id === currentRecordId);
        if (index !== -1) {
            recordsData[index] = { ...recordsData[index], album, artist, genre, price, stock, img };
            showCustomAlert('Thành công', `Đã cập nhật đĩa nhạc "${album}".`);
        }
    } else {
        // Logic THÊM
        const newId = 'REC' + (recordsData.length + 1).toString().padStart(3, '0');
        const newRecord = { id: newId, album, artist, genre, price, stock, img };
        recordsData.push(newRecord);
        showCustomAlert('Thành công', `Đã thêm đĩa nhạc "${album}" (ID: ${newId}).`);
    }

    closeModal('record-modal');
    loadView('records');
}

function deleteRecord(id) {
    const record = recordsData.find(r => r.id === id);
    if (!record) return;

    // Sử dụng window.confirm cho mục đích minh họa dễ nhất
    if (window.confirm(`Bạn có chắc chắn muốn xóa đĩa "${record.album}" không? (Lưu ý: Trong môi trường thực tế nên dùng Custom Modal)`)) {
        recordsData = recordsData.filter(r => r.id !== id);
        showCustomAlert('Thành công', `Đã xóa đĩa nhạc "${record.album}".`);
        loadView('records');
    }
}

function showOrderDetails(orderId) {
    const order = ordersData.find(o => o.id === orderId);
    if (!order) return;

    document.getElementById('order-modal-id').textContent = `#${order.id}`;
    const detailsContent = document.getElementById('order-details-content');
    let totalAmount = 0;
    
    const itemsHtml = order.items.map(item => {
        const product = recordsData.find(r => r.id === item.id);
        if (!product) return '';
        const subtotal = product.price * item.qty;
        totalAmount += subtotal;
        return `
            <div class="flex-row item-detail-row">
                <div class="flex-align-center item-info">
                    <img class="record-avatar small" src="${product.img}" alt="${product.album}" onerror="this.onerror=null;this.src='https://placehold.co/64x64/ddd/000?text=CD'">
                    <div>
                        <p class="font-medium">${product.album}</p>
                        <p class="text-sm-light">Nghệ sĩ: ${product.artist}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-bold text-sm price-text">${formatCurrency(subtotal)}</p>
                    <p class="text-xs-light">SL: ${item.qty} x ${formatCurrency(product.price)}</p>
                </div>
            </div>
        `;
    }).join('');

    detailsContent.innerHTML = `
        <p class="text-detail-label">Khách hàng: <span class="font-medium">${order.customer}</span></p>
        <p class="text-detail-label margin-bottom-16">Ngày đặt: <span class="font-medium">${order.date}</span></p>
        <div class="total-summary-row border-top-1 pt-8 mt-16">
            <span>TỔNG CỘNG:</span>
            <span class="total-price">${formatCurrency(totalAmount)}</span>
        </div>
        <h4 class="section-header border-top-1 pt-16 mt-16">Sản phẩm:</h4>
        ${itemsHtml}
    `;
    
    document.getElementById('order-details-modal').style.display = 'flex';
}

// --- 4. SEARCH & FILTER LOGIC ---

function attachRecordsViewListeners() {
    const searchInput = document.getElementById('record-search');
    const filterSelect = document.getElementById('record-filter-genre');
    
    const applyFilters = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedGenre = filterSelect.value;
        
        let filteredData = recordsData.filter(record => {
            // Lọc theo từ khóa (Album hoặc Artist)
            const matchesSearch = record.album.toLowerCase().includes(searchTerm) || 
                                  record.artist.toLowerCase().includes(searchTerm);
            
            // Lọc theo Thể loại
            const matchesGenre = selectedGenre === "" || record.genre === selectedGenre;
            
            return matchesSearch && matchesGenre;
        });
        
        // Render lại bảng với dữ liệu đã lọc
        const tableBody = document.getElementById('records-table-body');
        tableBody.innerHTML = renderRecordsTableRows(filteredData);
    };

    searchInput.addEventListener('input', applyFilters);
    filterSelect.addEventListener('change', applyFilters);
}

// Hàm phụ trợ để render HTML cho các dòng
function renderRecordsTableRows(data) {
     return data.map(record => `
        <tr>
            <td class="table-cell"><img class="record-avatar" style="width: 40px; height: 40px;" src="${record.img}" alt="Ảnh bìa" onerror="this.onerror=null;this.src='https://placehold.co/64x64/3730a3/ffffff?text=CD'"></td>
            <td class="table-cell">${record.id}</td>
            <td class="table-cell">
                <div class="font-medium">${record.album}</div>
                <div class="text-sm-light">${record.artist} (${record.genre})</div>
            </td>
            <td class="table-cell price-text">${formatCurrency(record.price)}</td>
            <td class="table-cell ${record.stock <= 10 ? 'stock-low' : 'stock-normal'}">${record.stock}</td>
            <td class="table-cell text-right">
                <button onclick="openRecordModal('edit', '${record.id}')" class="btn-link btn-edit">Sửa</button>
                <button onclick="deleteRecord('${record.id}')" class="btn-link btn-delete">Xóa</button>
            </td>
        </tr>
    `).join('');
}


// --- INITIALIZATION ---
window.onload = () => {
    loadView('dashboard'); // Tải Dashboard mặc định
    // Đảm bảo modal đóng khi nhấn phím ESC
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal('record-modal');
            closeModal('order-details-modal');
            closeModal('custom-alert-modal');
        }
    });
};
