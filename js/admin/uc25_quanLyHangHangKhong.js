let airlines = [
    {
        id: 1,
        code: "VN",
        name: "Vietnam Airlines",
        country: "Việt Nam",
        logo: "vn_airlines.png",
        status: "active",
        hasActiveFlights: true
    },
    {
        id: 2,
        code: "VJ",
        name: "Vietjet Air",
        country: "Việt Nam",
        logo: "vietjet.jpg",
        status: "active",
        hasActiveFlights: true
    },
    {
        id: 3,
        code: "QH",
        name: "Bamboo Airways",
        country: "Việt Nam",
        logo: "bamboo.jpeg",
        status: "inactive",
        hasActiveFlights: false
    }
];
let currentEditingId = null;
let currentDeletingId = null;
document.addEventListener('DOMContentLoaded', () => {
    renderTable();
});
function renderTable() {
    const tbody = document.getElementById('airline-table-body');
    tbody.innerHTML = '';
    if (airlines.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding: 30px;">
            <div style="color: #666; margin-bottom: 15px;">Chưa có hãng hàng không nào trong hệ thống</div>
            <button class="btn btn-primary" onclick="openForm('add')">Thêm hãng hàng không đầu tiên</button>
        </td></tr>`;
        return;
    }
    airlines.forEach(airline => {
        let statusBadge = airline.status === 'active' ? 'badge-active' : 'badge-inactive';
        let statusLabel = airline.status === 'active' ? 'Đang hợp tác' : 'Ngừng hợp tác';
        let logoUrl = `https://ui-avatars.com/api/?name=${airline.code}&background=random&color=fff`;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${logoUrl}" alt="${airline.name}" class="airline-logo-img"></td>
            <td><strong>${airline.code}</strong></td>
            <td>${airline.name}</td>
            <td>${airline.country}</td>
            <td><span class="badge ${statusBadge}">${statusLabel}</span></td>
            <td>
                <div class="action-btns">
                    <button class="btn btn-sm btn-secondary" onclick="openForm('edit', ${airline.id})" title="Chỉnh sửa">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="openDeleteModal(${airline.id})" title="Xóa">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}
function openForm(mode, id = null) {
    const modal = document.getElementById('airline-modal');
    const form = document.getElementById('airline-form');
    const title = document.getElementById('modal-title');
    hideAlert();
    form.reset();
    if (mode === 'add') {
        title.textContent = 'Thêm hãng hàng không mới';
        currentEditingId = null;
        document.getElementById('airline-code').disabled = false;
    } else {
        title.textContent = 'Cập nhật thông tin hãng';
        currentEditingId = id;
        const airline = airlines.find(a => a.id === id);
        if (airline) {
            document.getElementById('airline-code').value = airline.code;
            document.getElementById('airline-code').disabled = true;
            document.getElementById('airline-name').value = airline.name;
            document.getElementById('airline-country').value = airline.country;
            document.getElementById('airline-status').value = airline.status;
            document.getElementById('airline-logo').value = airline.logo;
        }
    }
    modal.classList.add('show');
}
function closeForm() {
    document.getElementById('airline-modal').classList.remove('show');
}
function showAlert(message, type) {
    const alertEl = document.getElementById('alert-message');
    alertEl.innerHTML = `<i class="fa-solid fa-${type === 'error' ? 'circle-exclamation' : 'circle-check'}"></i> ${message}`;
    alertEl.className = `alert alert-${type}`;
    alertEl.style.display = 'flex';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
        hideAlert();
    }, 5000);
}
function hideAlert() {
    const alertEl = document.getElementById('alert-message');
    alertEl.style.display = 'none';
}
function saveAirline() {
    const code = document.getElementById('airline-code').value.trim().toUpperCase();
    const name = document.getElementById('airline-name').value.trim();
    const country = document.getElementById('airline-country').value.trim();
    const status = document.getElementById('airline-status').value;
    const logo = document.getElementById('airline-logo').value.trim();
    if (!code) {
        alert("Mã hãng không được để trống.");
        return;
    }
    if (!name) {
        alert("Tên hãng hàng không không được để trống.");
        return;
    }
    if (!country || !logo) {
        alert("Vui lòng nhập đầy đủ các trường.");
        return;
    }
    if (!currentEditingId) {
        const isExists = airlines.some(a => a.code === code);
        if (isExists) {
            alert(`Mã hãng "${code}" đã tồn tại trên hệ thống.`);
            return;
        }
    }
    const logoRegex = /\.(jpg|jpeg|png)$/i;
    if (!logoRegex.test(logo)) {
        alert("Logo không đúng định dạng cho phép. Chỉ chấp nhận .jpg, .jpeg, .png");
        return;
    }
    if (currentEditingId) {
        const idx = airlines.findIndex(a => a.id === currentEditingId);
        if (idx !== -1) {
            airlines[idx].name = name;
            airlines[idx].country = country;
            airlines[idx].status = status;
            airlines[idx].logo = logo;
        }
    } else {
        const newId = airlines.length > 0 ? Math.max(...airlines.map(a => a.id)) + 1 : 1;
        airlines.push({
            id: newId,
            code: code,
            name: name,
            country: country,
            logo: logo,
            status: status,
            hasActiveFlights: false
        });
    }
    closeForm();
    renderTable();
    showAlert("Lưu thông tin hãng hàng không thành công.", "success");
}

function openDeleteModal(id) {
    const airline = airlines.find(a => a.id === id);
    if (!airline) return;
    if (airline.hasActiveFlights) {
        showAlert(`Không thể xóa hãng hàng không ${airline.name} vì đang được sử dụng (có chuyến bay đang hoạt động).`, "error");
        return;
    }
    currentDeletingId = id;
    document.getElementById('delete-airline-name').textContent = airline.name;
    document.getElementById('delete-modal').classList.add('show');
}
function closeDeleteModal() {
    document.getElementById('delete-modal').classList.remove('show');
    currentDeletingId = null;
}
function confirmDelete() {
    if (!currentDeletingId) return;
    const idx = airlines.findIndex(a => a.id === currentDeletingId);
    if (idx !== -1) {
        const deletedName = airlines[idx].name;
        airlines.splice(idx, 1);
        closeDeleteModal();
        renderTable();
        showAlert(`Đã xóa hãng hàng không ${deletedName} thành công.`, "success");
    }
}
