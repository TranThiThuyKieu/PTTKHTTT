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

    // Cập nhật giao diện điểm hiện tại
    updatePointsDisplay();
    // Tải danh sách phần thưởng
    renderRewards();
});

// Mock Dữ liệu Điểm tích lũy và Người dùng
let currentPoints = 15000;
let userHasUnusedPromoOfSameType = false; // Biến giả lập cho luồng phụ 6.6

// Mock Dữ liệu Danh sách ưu đãi
let rewards = [
    {
        id: 'R01',
        name: 'Voucher Giảm 200K',
        discount: 'Giảm 200.000 VNĐ',
        pointsReq: 2000,
        conditions: 'Đơn hàng từ 1.000.000 VNĐ. Áp dụng chuyến nội địa.',
        validity: '30 ngày kể từ ngày đổi',
        status: 'available',
        type: 'VOUCHER_200K'
    },
    {
        id: 'R02',
        name: 'Voucher Giảm 500K',
        discount: 'Giảm 500.000 VNĐ',
        pointsReq: 4500,
        conditions: 'Đơn hàng từ 2.000.000 VNĐ. Áp dụng mọi chuyến bay.',
        validity: '30 ngày kể từ ngày đổi',
        status: 'available',
        type: 'VOUCHER_500K'
    },
    {
        id: 'R03',
        name: 'Miễn phí Hành lý 20kg',
        discount: 'Hành lý 20kg',
        pointsReq: 3000,
        conditions: 'Áp dụng cho 1 chặng bay.',
        validity: '60 ngày kể từ ngày đổi',
        status: 'available',
        type: 'BAGGAGE_20KG'
    },
    {
        id: 'R04',
        name: 'Vé Khứ Hồi Nội Địa',
        discount: 'Giảm 100% Tiền Vé',
        pointsReq: 20000,
        conditions: 'Không bao gồm thuế phí. Đặt trước 14 ngày.',
        validity: '90 ngày kể từ ngày đổi',
        status: 'available',
        type: 'FREE_TICKET_DOMESTIC'
    },
    {
        id: 'R05',
        name: 'Quyền sử dụng Phòng Chờ VIP',
        discount: 'Vào Phòng Chờ Thương Gia',
        pointsReq: 5000,
        conditions: 'Tại các sân bay Tân Sơn Nhất, Nội Bài, Đà Nẵng.',
        validity: 'Sử dụng 1 lần trong 30 ngày.',
        status: 'unavailable', // Giả lập ưu đãi hết hạn/hết lượt (Luồng 6.3)
        type: 'VIP_LOUNGE'
    }
];

let selectedReward = null;

function updatePointsDisplay() {
    document.getElementById('current-points').textContent = currentPoints.toLocaleString('vi-VN');
}

function showAlert(message, type = 'error') {
    const alertEl = document.getElementById('alert-message');
    const icon = type === 'error' ? '<i class="fa-solid fa-circle-exclamation"></i>' : 
                 type === 'warning' ? '<i class="fa-solid fa-triangle-exclamation"></i>' :
                 '<i class="fa-solid fa-circle-check"></i>';
    alertEl.innerHTML = `${icon} <span>${message}</span>`;
    alertEl.className = `alert alert-${type}`;
    alertEl.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if(type === 'success') {
        setTimeout(() => alertEl.classList.add('hidden'), 5000);
    }
}

function hideAlert() {
    document.getElementById('alert-message').classList.add('hidden');
}

function renderRewards() {
    const listEl = document.getElementById('reward-list');
    const emptyState = document.getElementById('empty-state');
    listEl.innerHTML = '';

    if (rewards.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    } else {
        emptyState.classList.add('hidden');
    }

    rewards.forEach(reward => {
        const canAfford = currentPoints >= reward.pointsReq;
        const isAvailable = reward.status === 'available';
        
        let buttonHtml = '';
        if (!isAvailable) {
            buttonHtml = `<button class="btn btn-disabled" disabled>Hết số lượng</button>`;
        } else if (!canAfford) {
            buttonHtml = `<button class="btn btn-disabled" onclick="handleInsufficientPoints()">Không đủ điểm</button>`;
        } else {
            buttonHtml = `<button class="btn btn-primary" onclick="openRewardDetail('${reward.id}')">Đổi ngay</button>`;
        }

        const card = document.createElement('div');
        card.className = 'reward-card';
        // Nếu không có sẵn thì làm mờ thẻ
        if (!isAvailable) card.style.opacity = '0.7';

        card.innerHTML = `
            <div class="reward-card-top">
                <i class="fa-solid fa-gift reward-icon"></i>
                <h3 class="reward-name">${reward.name}</h3>
                <div class="reward-discount">${reward.discount}</div>
            </div>
            <div class="reward-card-body">
                <div class="reward-info-row">
                    <i class="fa-solid fa-circle-info"></i>
                    <span>${reward.conditions}</span>
                </div>
                <div class="reward-info-row">
                    <i class="fa-regular fa-clock"></i>
                    <span>${reward.validity}</span>
                </div>
            </div>
            <div class="reward-card-footer">
                <div class="points-required">
                    <i class="fa-solid fa-coins"></i> ${reward.pointsReq.toLocaleString('vi-VN')} điểm
                </div>
                ${buttonHtml}
            </div>
        `;
        listEl.appendChild(card);
    });
}

function handleInsufficientPoints() {
    // Luồng phụ 6.1: Số điểm tích lũy không đủ
    showAlert('Luồng 6.1: Số điểm tích lũy của bạn không đủ để đổi ưu đãi này.', 'error');
}

function openRewardDetail(rewardId) {
    hideAlert();
    
    // Giả lập Luồng 6.7: Phiên đăng nhập hết hạn (Random 5% xảy ra)
    if (Math.random() < 0.05) {
        showAlert('Luồng 6.7: Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', 'error');
        // Thực tế sẽ redirect ra trang đăng nhập
        return;
    }

    const reward = rewards.find(r => r.id === rewardId);
    if (!reward) return;

    // Giả lập Luồng phụ 6.3: Gói ưu đãi không còn khả dụng (khi ấn vào mới phát hiện ra)
    if (Math.random() < 0.05 || reward.status !== 'available') {
        showAlert('Luồng 6.3: Ưu đãi này hiện không còn khả dụng do đã hết lượt hoặc hết hạn.', 'error');
        reward.status = 'unavailable';
        renderRewards();
        return;
    }

    selectedReward = reward;
    
    const contentEl = document.getElementById('reward-detail-content');
    contentEl.innerHTML = `
        <table class="detail-table">
            <tr>
                <td>Tên ưu đãi</td>
                <td><strong>${reward.name}</strong></td>
            </tr>
            <tr>
                <td>Giá trị</td>
                <td><strong style="color: #2563eb;">${reward.discount}</strong></td>
            </tr>
            <tr>
                <td>Điều kiện sử dụng</td>
                <td>${reward.conditions}</td>
            </tr>
            <tr>
                <td>Thời hạn hiệu lực</td>
                <td>${reward.validity}</td>
            </tr>
        </table>
        <div class="points-deduct">
            Sẽ trừ: ${reward.pointsReq.toLocaleString('vi-VN')} điểm
        </div>
    `;

    document.getElementById('reward-modal').classList.add('show');
}

function closeRewardModal() {
    // Luồng phụ 6.2: Khách hàng hủy quá trình đổi điểm
    document.getElementById('reward-modal').classList.remove('show');
    selectedReward = null;
}

function confirmRedeem() {
    if (!selectedReward) return;

    // Luồng phụ 6.1 check lại lần cuối trước khi gọi server
    if (currentPoints < selectedReward.pointsReq) {
        document.getElementById('reward-modal').classList.remove('show');
        handleInsufficientPoints();
        return;
    }

    // Luồng phụ 6.6: Khách hàng đã sở hữu mã ưu đãi chưa sử dụng của cùng loại
    // Giả lập logic kiểm tra: nếu userHasUnusedPromoOfSameType = true
    // Random 10% xảy ra trường hợp này
    if (Math.random() < 0.1) {
        document.getElementById('reward-modal').classList.remove('show');
        document.getElementById('duplicate-warning-modal').classList.add('show');
        return;
    }

    // Nếu không vướng luồng 6.6 thì tiến hành đổi
    proceedRedeem();
}

function closeWarningModal() {
    // Luồng 6.6: Hủy giao dịch từ cảnh báo trùng lặp
    document.getElementById('duplicate-warning-modal').classList.remove('show');
    selectedReward = null;
    showAlert('Đã hủy giao dịch đổi điểm.', 'warning');
}

function proceedRedeem() {
    document.getElementById('duplicate-warning-modal').classList.remove('show');
    document.getElementById('reward-modal').classList.remove('show');

    // Luồng phụ 6.4: Lỗi cập nhật điểm tích lũy (Random 10%)
    if (Math.random() < 0.1) {
        showAlert('Luồng 6.4: Không thể xử lý yêu cầu đổi điểm. Vui lòng thử lại sau.', 'error');
        selectedReward = null;
        return;
    }

    // Trừ điểm
    currentPoints -= selectedReward.pointsReq;
    updatePointsDisplay();
    renderRewards(); // Render lại vì có thể có ưu đãi khác bị thiếu điểm sau khi trừ

    // Luồng phụ 6.5: Gửi mã ưu đãi thất bại (Random 10%)
    if (Math.random() < 0.1) {
        showAlert('Luồng 6.5: Đổi điểm thành công nhưng chưa thể gửi mã ưu đãi qua Email/SMS. Vui lòng kiểm tra mục ưu đãi của bạn hoặc thử gửi lại sau.', 'warning');
        selectedReward = null;
        return;
    }

    // Luồng chính: Thành công
    showAlert(`Luồng chính: Đổi điểm thành công! Mã ưu đãi "${selectedReward.name}" đã được gửi đến Email của bạn.`, 'success');
    selectedReward = null;
}
