let flights = [
    {
        id: 1,
        code: "VN123",
        route: "SGN-HAN",
        aircraft: "A320",
        departure: "2026-08-15T08:30",
        arrival: "2026-08-15T10:30",
        price: 1500000,
        status: "cho-bay",
        hasBookings: true
    },
    {
        id: 2,
        code: "VJ456",
        route: "HAN-DAD",
        aircraft: "A321",
        departure: "2026-08-20T14:00",
        arrival: "2026-08-20T15:20",
        price: 850000,
        status: "cho-bay",
        hasBookings: false
    },
    {
        id: 3,
        code: "QH789",
        route: "DAD-SGN",
        aircraft: "B787",
        departure: "2026-07-10T09:00",
        arrival: "2026-07-10T10:15",
        price: 1200000,
        status: "da-bay",
        hasBookings: true
    }
];
let currentEditingId = null;
let currentDeletingId = null;
document.addEventListener('DOMContentLoaded', () => {
    renderTable();
});
function renderTable() {
    const tbody = document.getElementById('flight-table-body');
    tbody.innerHTML = '';
    if (flights.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center">Chưa có dữ liệu chuyến bay</td></tr>`;
        return;
    }
    flights.forEach(flight => {
        let statusBadge = '';
        let statusLabel = '';
        switch(flight.status) {
            case 'cho-bay': statusBadge = 'badge-cho-bay'; statusLabel = 'Chờ bay'; break;
            case 'hoan-chuyen': statusBadge = 'badge-hoan-chuyen'; statusLabel = 'Hoãn chuyến'; break;
            case 'huy-chuyen': statusBadge = 'badge-huy-chuyen'; statusLabel = 'Hủy chuyến'; break;
            case 'da-bay': statusBadge = 'badge-da-bay'; statusLabel = 'Đã bay'; break;
        }
        const formatDateTime = (dt) => {
            const date = new Date(dt);
            return date.toLocaleString('vi-VN', {hour: '2-digit', minute:'2-digit', day: '2-digit', month: '2-digit', year: 'numeric'});
        };
        const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${flight.code}</strong></td>
            <td>${flight.route}</td>
            <td>${flight.aircraft}</td>
            <td>${formatDateTime(flight.departure)}</td>
            <td>${formatDateTime(flight.arrival)}</td>
            <td>${formatPrice(flight.price)}</td>
            <td><span class="badge ${statusBadge}">${statusLabel}</span></td>
            <td>
                <div class="action-btns">
                    <button class="btn btn-sm btn-secondary" onclick="openForm('edit', ${flight.id})" title="Chỉnh sửa">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="openDeleteModal(${flight.id})" title="Xóa">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}
function openForm(mode, id = null) {
    const modal = document.getElementById('flight-modal');
    const form = document.getElementById('flight-form');
    const title = document.getElementById('modal-title');
    hideAlert();
    form.reset();
    if (mode === 'add') {
        title.textContent = 'Thêm chuyến bay mới';
        currentEditingId = null;
    } else {
        title.textContent = 'Cập nhật chuyến bay';
        currentEditingId = id;
        const flight = flights.find(f => f.id === id);
        if (flight) {
            document.getElementById('flight-code').value = flight.code;
            document.getElementById('route').value = flight.route;
            document.getElementById('aircraft').value = flight.aircraft;
            document.getElementById('departure-time').value = flight.departure;
            document.getElementById('arrival-time').value = flight.arrival;
            document.getElementById('price').value = flight.price;
            document.getElementById('status').value = flight.status;
        }
    }
    modal.classList.add('show');
}
function closeForm() {
    document.getElementById('flight-modal').classList.remove('show');
}
function showAlert(message, type) {
    const alertEl = document.getElementById('alert-message');
    alertEl.innerHTML = `<i class="fa-solid fa-${type === 'error' ? 'circle-exclamation' : type === 'success' ? 'circle-check' : 'bell'}"></i> ${message}`;
    alertEl.className = `alert alert-${type}`;
    alertEl.style.display = 'flex';
    setTimeout(() => {
        hideAlert();
    }, 5000);
}
function hideAlert() {
    const alertEl = document.getElementById('alert-message');
    alertEl.style.display = 'none';
}
function saveFlight() {
    const code = document.getElementById('flight-code').value.trim();
    const route = document.getElementById('route').value;
    const aircraft = document.getElementById('aircraft').value;
    const departure = document.getElementById('departure-time').value;
    const arrival = document.getElementById('arrival-time').value;
    const price = parseInt(document.getElementById('price').value);
    const status = document.getElementById('status').value;
    if (!code || !route || !aircraft || !departure || !arrival || !price) {
        alert("Vui lòng điền đầy đủ các trường bắt buộc.");
        return;
    }
    const now = new Date();
    const depTime = new Date(departure);
    const arrTime = new Date(arrival);
    if (depTime < now && status !== 'da-bay') {
        alert("Thời gian khởi hành không được nằm trong quá khứ.");
        return;
    }
    if (arrTime <= depTime) {
        alert("Thời gian hạ cánh phải lớn hơn thời gian khởi hành.");
        return;
    }
    if (price <= 0) {
        alert("Giá vé phải lớn hơn 0.");
        return;
    }
    let oldStatus = null;
    let oldCode = null;
    if (currentEditingId) {
        const flightIndex = flights.findIndex(f => f.id === currentEditingId);
        oldStatus = flights[flightIndex].status;
        oldCode = flights[flightIndex].code;
        flights[flightIndex] = {
            ...flights[flightIndex],
            code, route, aircraft, departure, arrival, price, status
        };
    } else {
        const newId = flights.length > 0 ? Math.max(...flights.map(f => f.id)) + 1 : 1;
        flights.push({
            id: newId, code, route, aircraft, departure, arrival, price, status,
            hasBookings: false
        });
    }
    closeForm();
    renderTable();
    let successMsg = "Lưu thông tin chuyến bay thành công.";
    if (currentEditingId && oldStatus !== status) {
        if (status === 'hoan-chuyen') {
            successMsg += ` Hệ thống đã tự động gửi Email/SMS thông báo lịch bay mới cho hành khách chuyến ${code}.`;
            showAlert(successMsg, "warning");
            return;
        } else if (status === 'huy-chuyen') {
            successMsg += ` Hệ thống đã tự động gửi Email/SMS thông báo hủy chuyến cho hành khách. Danh sách vé bị ảnh hưởng đã được chuyển sang Use Case Hoàn tiền.`;
            showAlert(successMsg, "error");
            return;
        }
    }
    showAlert(successMsg, "success");
}
function openDeleteModal(id) {
    const flight = flights.find(f => f.id === id);
    if (!flight) return;
    currentDeletingId = id;
    document.getElementById('delete-flight-code').textContent = flight.code;
    document.getElementById('delete-modal').classList.add('show');
}
function closeDeleteModal() {
    document.getElementById('delete-modal').classList.remove('show');
    currentDeletingId = null;
}
function confirmDelete() {
    const flightIndex = flights.findIndex(f => f.id === currentDeletingId);
    if (flightIndex === -1) return;
    const flight = flights[flightIndex];
    if (flight.hasBookings) {
        closeDeleteModal();
        showAlert(`Không thể xóa chuyến bay ${flight.code} vì đã có khách đặt vé. Vui lòng sử dụng chức năng Hủy chuyến.`, "error");
        return;
    }
    flights.splice(flightIndex, 1);
    closeDeleteModal();
    renderTable();
    showAlert(`Đã xóa chuyến bay ${flight.code} thành công.`, "success");
}
