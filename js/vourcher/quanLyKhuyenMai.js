const promotions = [
    {
        id: 1,
        name: 'Giảm 20% cho khách hàng mới',
        code: 'WELCOME20',
        type: 'Giảm phần trăm',
        value: 20,
        startDate: '2026-07-01',
        endDate: '2026-07-31',
        target: 'Khách hàng mới',
        status: 'Đang hoạt động'
    },
    {
        id: 2,
        name: 'Miễn phí hành lý phổ thông',
        code: 'BAGFREE',
        type: 'Miễn phí hành lý',
        value: 1,
        startDate: '2026-08-01',
        endDate: '2026-08-15',
        target: 'Tất cả khách hàng',
        status: 'Sắp diễn ra'
    },
    {
        id: 3,
        name: 'Giảm 100.000đ cho chuyến nội địa',
        code: 'LOCAL100',
        type: 'Giảm tiền',
        value: 100000,
        startDate: '2026-06-01',
        endDate: '2026-06-20',
        target: 'Chuyến bay nội địa',
        status: 'Đã kết thúc'
    }
];

const tableBody = document.getElementById('promotionTableBody');
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const resetFiltersBtn = document.getElementById('resetFiltersBtn');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelBtn = document.getElementById('cancelBtn');
const modal = document.getElementById('promotionModal');
const form = document.getElementById('promotionForm');
const modalTitle = document.getElementById('modalTitle');
const promotionIdInput = document.getElementById('promotionId');

function renderTable(list) {
    tableBody.innerHTML = '';

    if (!list.length) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:#64748b;">Không có dữ liệu</td></tr>';
        return;
    }

    list.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.code}</td>
            <td>${item.name}</td>
            <td>${item.type}</td>
            <td>${item.type === 'Giảm phần trăm' ? item.value + '%' : item.type === 'Giảm tiền' ? item.value.toLocaleString('vi-VN') + 'đ' : '1 kiện'}</td>
            <td>${item.startDate} → ${item.endDate}</td>
            <td><span class="status-badge">${item.status}</span></td>
            <td>
                <div style="display: flex; gap: 8px; flex-wrap: nowrap;">
                <button class="action-btn action-edit" data-id="${item.id}">Sửa</button>
                <button class="action-btn action-delete" data-id="${item.id}">Xóa</button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function getStatusCounts(list) {
    document.getElementById('totalPromotions').textContent = list.length;
    document.getElementById('activePromotions').textContent = list.filter(item => item.status === 'Đang hoạt động').length;
    document.getElementById('upcomingPromotions').textContent = list.filter(item => item.status === 'Sắp diễn ra').length;
    document.getElementById('endedPromotions').textContent = list.filter(item => item.status === 'Đã kết thúc').length;
}

function filterPromotions() {
    const keyword = searchInput.value.toLowerCase();
    const status = statusFilter.value;

    const filtered = promotions.filter(item => {
        const matchesKeyword = item.name.toLowerCase().includes(keyword) || item.code.toLowerCase().includes(keyword);
        const matchesStatus = status === 'all' || item.status === status;
        return matchesKeyword && matchesStatus;
    });

    renderTable(filtered);
}

function openModal() {
    form.reset();
    promotionIdInput.value = '';
    modalTitle.textContent = 'Tạo khuyến mãi';
    modal.classList.remove('hidden');
}

function closeModal() {
    modal.classList.add('hidden');
}

form.addEventListener('submit', function (e) {
    e.preventDefault();
    const id = Number(promotionIdInput.value) || Date.now();
    const newPromotion = {
        id,
        name: document.getElementById('name').value,
        code: document.getElementById('code').value,
        type: document.getElementById('type').value,
        value: Number(document.getElementById('value').value),
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value,
        target: document.getElementById('target').value,
        status: document.getElementById('status').value
    };

    const index = promotions.findIndex(item => item.id === id);
    if (index >= 0) {
        promotions[index] = newPromotion;
    } else {
        promotions.push(newPromotion);
    }

    getStatusCounts(promotions);
    filterPromotions();
    closeModal();
});

tableBody.addEventListener('click', function (e) {
    const target = e.target;
    if (target.classList.contains('action-edit')) {
        const id = Number(target.dataset.id);
        const item = promotions.find(p => p.id === id);
        if (item) {
            promotionIdInput.value = item.id;
            document.getElementById('name').value = item.name;
            document.getElementById('code').value = item.code;
            document.getElementById('type').value = item.type;
            document.getElementById('value').value = item.value;
            document.getElementById('startDate').value = item.startDate;
            document.getElementById('endDate').value = item.endDate;
            document.getElementById('target').value = item.target;
            document.getElementById('status').value = item.status;
            modalTitle.textContent = 'Cập nhật khuyến mãi';
            modal.classList.remove('hidden');
        }
    }

    if (target.classList.contains('action-delete')) {
        const id = Number(target.dataset.id);
        const index = promotions.findIndex(item => item.id === id);
        if (index >= 0) {
            promotions.splice(index, 1);
            getStatusCounts(promotions);
            filterPromotions();
        }
    }
});

searchInput.addEventListener('input', filterPromotions);
statusFilter.addEventListener('change', filterPromotions);
resetFiltersBtn.addEventListener('click', function () {
    searchInput.value = '';
    statusFilter.value = 'all';
    filterPromotions();
});
openModalBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);
modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
});

getStatusCounts(promotions);
renderTable(promotions);
