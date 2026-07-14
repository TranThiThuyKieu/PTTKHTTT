document.addEventListener("DOMContentLoaded", () => {
    // Tải header và footer chuẩn của hệ thống
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;
            if (typeof initHeader === 'function') initHeader();
        });
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer').innerHTML = data;
        });

    // Tải danh sách khuyến mãi
    loadPromotions();
});

// Mock dữ liệu khuyến mãi
let promotions = [
    {
        id: 'SUMMER24',
        name: 'Chào Hè Rực Rỡ 2024',
        discount: 'Giảm 20%',
        startDate: '01/06/2026',
        endDate: '31/08/2026',
        status: 'ongoing', // ongoing, upcoming, expired
        conditions: 'Áp dụng cho mọi hạng vé',
        ticketClass: 'Tất cả hạng vé',
        route: 'Toàn mạng bay nội địa',
        minOrderValue: '2.000.000 VNĐ',
        maxUsage: 1000
    },
    {
        id: 'VIPMEMBER',
        name: 'Ưu đãi Đặc Quyền Thành Viên VIP',
        discount: 'Giảm 500k',
        startDate: '01/01/2026',
        endDate: '31/12/2026',
        status: 'ongoing',
        conditions: 'Chỉ áp dụng cho tài khoản VIP',
        ticketClass: 'Thương gia',
        route: 'Tất cả các chuyến bay',
        minOrderValue: '5.000.000 VNĐ',
        maxUsage: 500
    },
    {
        id: 'WINTER25',
        name: 'Đón Tuyết Rơi - Ưu Đãi Bất Ngờ',
        discount: 'Giảm 10%',
        startDate: '01/12/2026',
        endDate: '28/02/2027',
        status: 'upcoming',
        conditions: 'Không áp dụng cùng khuyến mãi khác',
        ticketClass: 'Phổ thông, Phổ thông đặc biệt',
        route: 'Quốc tế',
        minOrderValue: 'Không yêu cầu',
        maxUsage: 2000
    },
    {
        id: 'TET24',
        name: 'Bay Cùng Gia Đình Mùa Tết',
        discount: 'Giảm 30%',
        startDate: '10/01/2026',
        endDate: '15/02/2026',
        status: 'expired',
        conditions: 'Áp dụng khi đặt từ 4 vé trở lên',
        ticketClass: 'Tất cả hạng vé',
        route: 'Nội địa',
        minOrderValue: '4.000.000 VNĐ',
        maxUsage: 3000
    }
];

let currentFilter = 'all';
let currentSelectedPromo = null;

function showAlert(message, type = 'error') {
    const alertEl = document.getElementById('alert-message');
    const icon = type === 'error' ? '<i class="fa-solid fa-circle-exclamation"></i>' : 
                 '<i class="fa-solid fa-circle-check"></i>';
    alertEl.innerHTML = `${icon} <span>${message}</span>`;
    alertEl.className = `alert alert-${type}`;
    alertEl.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if(type === 'success') {
        setTimeout(() => alertEl.classList.add('hidden'), 3000);
    }
}

function loadPromotions() {
    // Giả lập Luồng phụ 13.3: Lỗi kết nối lấy dữ liệu
    if (Math.random() < 0.05) {
        document.getElementById('promo-list').innerHTML = '';
        showAlert('Luồng 13.3: Không thể tải thông tin khuyến mãi. Vui lòng thử lại sau.', 'error');
        return;
    }

    renderPromos();
}

function filterPromos(status) {
    // Luồng phụ 13.2: Lọc danh sách khuyến mãi
    currentFilter = status;
    
    // Đổi active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.status === status) {
            btn.classList.add('active');
        }
    });

    renderPromos();
}

function renderPromos() {
    const promoListEl = document.getElementById('promo-list');
    const emptyStateEl = document.getElementById('empty-state');
    promoListEl.innerHTML = '';
    
    // Lọc theo trạng thái
    const filteredPromos = currentFilter === 'all' 
        ? promotions 
        : promotions.filter(p => p.status === currentFilter);

    // Luồng phụ 13.1: Không có khuyến mãi khả dụng
    if (filteredPromos.length === 0) {
        emptyStateEl.classList.remove('hidden');
        return;
    } else {
        emptyStateEl.classList.add('hidden');
    }

    filteredPromos.forEach(promo => {
        let badgeHtml = '';
        let cardClass = 'promo-card';
        
        if (promo.status === 'ongoing') {
            badgeHtml = '<span class="badge badge-ongoing">Đang diễn ra</span>';
        } else if (promo.status === 'upcoming') {
            badgeHtml = '<span class="badge badge-upcoming">Sắp diễn ra</span>';
            cardClass += ' upcoming';
        } else if (promo.status === 'expired') {
            badgeHtml = '<span class="badge badge-expired">Đã hết hạn</span>';
            cardClass += ' expired';
        }

        const card = document.createElement('div');
        card.className = cardClass;
        card.innerHTML = `
            <div class="promo-header">
                <h3 class="promo-title">${promo.name}</h3>
                <div class="promo-value">${promo.discount}</div>
                ${badgeHtml}
            </div>
            <div class="promo-body">
                <div class="promo-info-row">
                    <i class="fa-regular fa-calendar"></i>
                    <span>${promo.startDate} - ${promo.endDate}</span>
                </div>
                <div class="promo-info-row">
                    <i class="fa-solid fa-plane"></i>
                    <span>${promo.route}</span>
                </div>
                <div class="promo-info-row">
                    <i class="fa-solid fa-circle-info"></i>
                    <span>${promo.conditions}</span>
                </div>
            </div>
            <div class="promo-footer">
                <span class="promo-code-text">${promo.id}</span>
                <button class="btn btn-outline" onclick="openPromoDetail('${promo.id}')">Xem chi tiết</button>
            </div>
        `;
        promoListEl.appendChild(card);
    });
}

function openPromoDetail(promoId) {
    // Luồng phụ 13.4: Mã khuyến mãi không còn tồn tại
    // Giả lập random 5% bị lỗi này
    if (Math.random() < 0.05) {
        showAlert('Luồng 13.4: Khuyến mãi này hiện không còn khả dụng do đã bị gỡ bỏ.', 'error');
        // Xóa khỏi list và render lại
        promotions = promotions.filter(p => p.id !== promoId);
        renderPromos();
        return;
    }

    const promo = promotions.find(p => p.id === promoId);
    if (!promo) return;

    currentSelectedPromo = promo;
    const contentEl = document.getElementById('promo-detail-content');
    const copyBtn = document.getElementById('btn-copy-code');
    
    let expiredWarningHtml = '';
    // Luồng phụ 13.5: Mã khuyến mãi đã hết hạn
    if (promo.status === 'expired') {
        expiredWarningHtml = `
            <div class="alert alert-error" style="margin-bottom: 20px;">
                <i class="fa-solid fa-circle-exclamation"></i>
                <span>Mã khuyến mãi này đã hết hạn và không thể sử dụng.</span>
            </div>
        `;
        copyBtn.disabled = true;
        copyBtn.innerHTML = 'Đã hết hạn';
    } else if (promo.status === 'upcoming') {
        expiredWarningHtml = `
            <div class="alert alert-warning" style="margin-bottom: 20px; background: #fffbeb; color: #b45309; border: 1px solid #fde68a;">
                <i class="fa-solid fa-clock"></i>
                <span>Chương trình chưa bắt đầu. Hãy quay lại sau nhé!</span>
            </div>
        `;
        copyBtn.disabled = true;
        copyBtn.innerHTML = 'Chưa bắt đầu';
    } else {
        copyBtn.disabled = false;
        copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Sao chép mã';
    }

    contentEl.innerHTML = `
        ${expiredWarningHtml}
        <div class="detail-code">${promo.id}</div>
        <table class="detail-table">
            <tr>
                <td>Tên chương trình</td>
                <td>${promo.name}</td>
            </tr>
            <tr>
                <td>Giá trị ưu đãi</td>
                <td><strong style="color: #2563eb;">${promo.discount}</strong></td>
            </tr>
            <tr>
                <td>Thời gian hiệu lực</td>
                <td>${promo.startDate} - ${promo.endDate}</td>
            </tr>
            <tr>
                <td>Điều kiện áp dụng</td>
                <td>${promo.conditions}</td>
            </tr>
            <tr>
                <td>Hạng vé áp dụng</td>
                <td>${promo.ticketClass}</td>
            </tr>
            <tr>
                <td>Chặng bay áp dụng</td>
                <td>${promo.route}</td>
            </tr>
            <tr>
                <td>Giá trị đơn tối thiểu</td>
                <td>${promo.minOrderValue}</td>
            </tr>
            <tr>
                <td>Số lần sử dụng tối đa</td>
                <td>${promo.maxUsage} lần</td>
            </tr>
        </table>
    `;

    document.getElementById('promo-modal').classList.add('show');
}

function closePromoModal() {
    // Luồng phụ 13.6: Khách hàng hủy xem chi tiết
    document.getElementById('promo-modal').classList.remove('show');
    currentSelectedPromo = null;
}

function copyCode() {
    if (!currentSelectedPromo) return;
    
    // Sao chép mã vào clipboard
    navigator.clipboard.writeText(currentSelectedPromo.id).then(() => {
        const copyBtn = document.getElementById('btn-copy-code');
        const originalText = copyBtn.innerHTML;
        
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Đã sao chép';
        copyBtn.classList.replace('btn-primary', 'btn-success');
        copyBtn.style.background = '#10b981';
        copyBtn.style.color = '#fff';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.classList.replace('btn-success', 'btn-primary');
            copyBtn.style.background = '';
        }, 2000);
    });
}
