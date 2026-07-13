// Dữ liệu mẫu (Mock Data)
let routes = [
    { id: 'T001', departure: 'SGN', arrival: 'HAN', distance: 1190, duration: 125, status: 'active' },
    { id: 'T002', departure: 'HAN', arrival: 'DAD', distance: 628, duration: 80, status: 'active' },
    { id: 'T003', departure: 'SGN', arrival: 'PQC', distance: 300, duration: 60, status: 'active' },
    { id: 'T004', departure: 'DAD', arrival: 'VCA', distance: 750, duration: 95, status: 'inactive' }
];

const airportMap = {
    'SGN': 'Hồ Chí Minh (SGN)',
    'HAN': 'Hà Nội (HAN)',
    'DAD': 'Đà Nẵng (DAD)',
    'PQC': 'Phú Quốc (PQC)',
    'VCA': 'Cần Thơ (VCA)'
};

let currentAction = 'add';
let routeToDelete = null;

// Khởi tạo
document.addEventListener('DOMContentLoaded', () => {
    renderTable();
});

// Render Bảng Tuyến Bay
function renderTable() {
    const tbody = document.getElementById('route-table-body');
    tbody.innerHTML = '';
    
    if (routes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center" style="padding: 30px;">Không có dữ liệu tuyến bay trong hệ thống.</td></tr>';
        return;
    }

    routes.forEach(route => {
        const tr = document.createElement('tr');
        const statusBadge = route.status === 'active' 
            ? '<span class="badge badge-active"><i class="fa-solid fa-check-circle"></i> Đang khai thác</span>' 
            : '<span class="badge badge-inactive"><i class="fa-solid fa-minus-circle"></i> Ngừng khai thác</span>';

        tr.innerHTML = `
            <td><strong>${route.id}</strong></td>
            <td>${airportMap[route.departure]}</td>
            <td>${airportMap[route.arrival]}</td>
            <td>${route.distance.toLocaleString()} km</td>
            <td>${route.duration} phút</td>
            <td>${statusBadge}</td>
            <td class="action-btns">
                <button class="btn btn-sm btn-secondary" onclick="openForm('edit', '${route.id}')" title="Cập nhật tuyến bay">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="openDeleteModal('${route.id}')" title="Xóa tuyến bay">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Hiển thị / Ẩn thông báo
function showAlert(message, type = 'error') {
    const alertEl = document.getElementById('alert-message');
    const icon = type === 'error' ? '<i class="fa-solid fa-circle-exclamation"></i>' : '<i class="fa-solid fa-circle-check"></i>';
    alertEl.innerHTML = `${icon} ${message}`;
    alertEl.className = `alert alert-${type}`;
    alertEl.style.display = 'flex';
    
    // Tự động ẩn thông báo thành công sau 4s
    if(type === 'success') {
        setTimeout(() => {
            alertEl.style.display = 'none';
        }, 4000);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hideAlert() {
    document.getElementById('alert-message').style.display = 'none';
}

// Logic mở Form (Thêm / Cập nhật)
function openForm(action, routeId = null) {
    hideAlert();
    currentAction = action;
    const modal = document.getElementById('route-modal');
    const title = document.getElementById('modal-title');
    const form = document.getElementById('route-form');
    
    form.reset(); // Xóa dữ liệu cũ (Luồng phụ 24.3)
    
    if (action === 'add') {
        title.textContent = 'Thêm tuyến bay mới';
        document.getElementById('route-id').value = '';
    } else if (action === 'edit') {
        title.textContent = 'Cập nhật tuyến bay';
        const route = routes.find(r => r.id === routeId);
        if (route) {
            document.getElementById('route-id').value = route.id;
            document.getElementById('departure').value = route.departure;
            document.getElementById('arrival').value = route.arrival;
            document.getElementById('distance').value = route.distance;
            document.getElementById('duration').value = route.duration;
            document.getElementById('status').value = route.status;
        } else {
            // Luồng phụ 24.5: Không tìm thấy tuyến bay cần cập nhật
            showAlert('Lỗi dữ liệu: Không tìm thấy thông tin tuyến bay cần xử lý. Dữ liệu có thể đã bị xóa.', 'error');
            renderTable();
            return;
        }
    }
    
    modal.classList.add('show');
}

// Logic đóng Form (Luồng phụ 24.3: Người dùng hủy thao tác)
function closeForm() {
    document.getElementById('route-modal').classList.remove('show');
}

// Lưu Tuyến Bay (Luồng chính)
function saveRoute() {
    const id = document.getElementById('route-id').value;
    const departure = document.getElementById('departure').value;
    const arrival = document.getElementById('arrival').value;
    const distance = parseInt(document.getElementById('distance').value);
    const duration = parseInt(document.getElementById('duration').value);
    const status = document.getElementById('status').value;

    // Luồng phụ 24.1: Thiếu thông tin
    if (!departure || !arrival || isNaN(distance) || isNaN(duration)) {
        showAlert('Vui lòng nhập đầy đủ các thông tin bắt buộc.', 'error');
        return;
    }

    // Luồng phụ 24.1: Sân bay trùng nhau
    if (departure === arrival) {
        showAlert('Sân bay đi và sân bay đến không được trùng nhau.', 'error');
        return;
    }

    // Luồng phụ 24.1: Khoảng cách hoặc thời gian không hợp lệ
    if (distance <= 0 || duration <= 0) {
        showAlert('Khoảng cách và thời gian bay phải lớn hơn 0.', 'error');
        return;
    }

    // Luồng phụ 24.1: Trùng lặp tuyến bay
    const isDuplicate = routes.some(r => r.departure === departure && r.arrival === arrival && r.id !== id);
    if (isDuplicate) {
        showAlert(`Tuyến bay từ ${airportMap[departure]} đến ${airportMap[arrival]} đã tồn tại trong hệ thống.`, 'error');
        return;
    }

    // Giả lập lỗi hệ thống (Luồng phụ 24.4)
    if (Math.random() < 0.05) { // 5% xác suất xảy ra lỗi DB
        showAlert('Lỗi hệ thống: Không thể lưu dữ liệu vào lúc này. Vui lòng thử lại sau.', 'error');
        closeForm();
        return;
    }

    if (currentAction === 'add') {
        const newId = 'T00' + (routes.length + 1);
        routes.push({ id: newId, departure, arrival, distance, duration, status });
        showAlert('Thêm tuyến bay mới thành công!', 'success');
    } else {
        const index = routes.findIndex(r => r.id === id);
        if (index !== -1) {
            routes[index] = { id, departure, arrival, distance, duration, status };
            showAlert('Cập nhật thông tin tuyến bay thành công!', 'success');
        }
    }

    closeForm();
    renderTable();
}

// Mở Modal Xác nhận xóa
function openDeleteModal(routeId) {
    hideAlert();
    routeToDelete = routeId;
    document.getElementById('delete-route-code').textContent = routeId;
    document.getElementById('delete-modal').classList.add('show');
}

// Đóng Modal Xóa (Luồng phụ 24.3)
function closeDeleteModal() {
    routeToDelete = null;
    document.getElementById('delete-modal').classList.remove('show');
}

// Xác nhận Xóa (Luồng phụ 24.2)
function confirmDelete() {
    if (!routeToDelete) return;

    // Giả lập Luồng phụ 24.2: Tồn tại ràng buộc (ví dụ tuyến T001 và T002 đang được sử dụng)
    if (routeToDelete === 'T001' || routeToDelete === 'T002') {
        showAlert('Thao tác bị từ chối: Không thể xóa tuyến bay đang được sử dụng trong các chuyến bay sắp khởi hành.', 'error');
        closeDeleteModal();
        return;
    }

    // Luồng chính: Thực hiện xóa
    routes = routes.filter(r => r.id !== routeToDelete);
    
    showAlert(`Đã xóa thành công tuyến bay ${routeToDelete}.`, 'success');
    closeDeleteModal();
    renderTable();
}
