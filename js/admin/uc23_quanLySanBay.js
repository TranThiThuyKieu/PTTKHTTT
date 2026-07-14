// Dữ liệu mẫu (Mock Data)
let airports = [
    { id: 'SGN', name: 'Tân Sơn Nhất', city: 'Hồ Chí Minh', country: 'Việt Nam', status: 'active' },
    { id: 'HAN', name: 'Nội Bài', city: 'Hà Nội', country: 'Việt Nam', status: 'active' },
    { id: 'DAD', name: 'Đà Nẵng', city: 'Đà Nẵng', country: 'Việt Nam', status: 'active' },
    { id: 'PQC', name: 'Phú Quốc', city: 'Kiên Giang', country: 'Việt Nam', status: 'active' },
    { id: 'VCA', name: 'Cần Thơ', city: 'Cần Thơ', country: 'Việt Nam', status: 'inactive' }
];

let currentAction = 'add';
let airportToDelete = null;

// Khởi tạo
document.addEventListener('DOMContentLoaded', () => {
    renderTable();
});

// Render Bảng Sân Bay
function renderTable() {
    const tbody = document.getElementById('airport-table-body');
    tbody.innerHTML = '';
    
    if (airports.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center" style="padding: 30px;">Không có dữ liệu sân bay trong hệ thống.</td></tr>';
        return;
    }

    airports.forEach(airport => {
        const tr = document.createElement('tr');
        const statusBadge = airport.status === 'active' 
            ? '<span class="badge badge-active"><i class="fa-solid fa-check-circle"></i> Đang hoạt động</span>' 
            : '<span class="badge badge-inactive"><i class="fa-solid fa-minus-circle"></i> Ngừng hoạt động</span>';

        tr.innerHTML = `
            <td><strong>${airport.id}</strong></td>
            <td>${airport.name}</td>
            <td>${airport.city}</td>
            <td>${airport.country}</td>
            <td>${statusBadge}</td>
            <td class="action-btns">
                <button class="btn btn-sm btn-secondary" onclick="openForm('edit', '${airport.id}')" title="Cập nhật sân bay">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="openDeleteModal('${airport.id}')" title="Xóa sân bay">
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
function openForm(action, airportId = null) {
    hideAlert();
    currentAction = action;
    const modal = document.getElementById('airport-modal');
    const title = document.getElementById('modal-title');
    const form = document.getElementById('airport-form');
    
    form.reset(); // Xóa dữ liệu cũ (Luồng phụ 23.3)
    
    if (action === 'add') {
        title.textContent = 'Thêm sân bay mới';
        document.getElementById('original-airport-id').value = '';
        document.getElementById('airport-id').disabled = false;
    } else if (action === 'edit') {
        title.textContent = 'Cập nhật sân bay';
        const airport = airports.find(a => a.id === airportId);
        if (airport) {
            document.getElementById('original-airport-id').value = airport.id;
            document.getElementById('airport-id').value = airport.id;
            // Không cho phép sửa mã sân bay khi cập nhật
            document.getElementById('airport-id').disabled = true;
            document.getElementById('airport-name').value = airport.name;
            document.getElementById('city').value = airport.city;
            document.getElementById('country').value = airport.country;
            document.getElementById('status').value = airport.status;
        } else {
            // Luồng phụ 23.5: Không tìm thấy sân bay cần cập nhật
            showAlert('Lỗi dữ liệu: Không tìm thấy dữ liệu sân bay cần xử lý.', 'error');
            renderTable();
            return;
        }
    }
    
    modal.classList.add('show');
}

// Logic đóng Form (Luồng phụ 23.3: Người dùng hủy thao tác)
function closeForm() {
    document.getElementById('airport-modal').classList.remove('show');
}

// Lưu Sân Bay (Luồng chính)
function saveAirport() {
    const originalId = document.getElementById('original-airport-id').value;
    let id = document.getElementById('airport-id').value.trim();
    const name = document.getElementById('airport-name').value.trim();
    const city = document.getElementById('city').value.trim();
    const country = document.getElementById('country').value.trim();
    const status = document.getElementById('status').value;

    // Luồng phụ 23.1: Dữ liệu sân bay không hợp lệ hoặc trùng lặp
    // Mã bị bỏ trống
    if (!id) {
        showAlert('Vui lòng nhập mã sân bay.', 'error');
        return;
    }
    // Mã không đúng định dạng 3 ký tự (IATA)
    if (id.length !== 3 || !/^[A-Z]+$/.test(id)) {
        showAlert('Mã sân bay không hợp lệ (phải gồm 3 ký tự chữ in hoa).', 'error');
        return;
    }
    // Tên bị bỏ trống
    if (!name) {
        showAlert('Vui lòng nhập tên sân bay.', 'error');
        return;
    }
    // Thành phố hoặc quốc gia chưa được nhập
    if (!city || !country) {
        showAlert('Vui lòng nhập đầy đủ thành phố và quốc gia.', 'error');
        return;
    }

    // Mã sân bay nhập mới đã tồn tại trong hệ thống
    const isDuplicate = airports.some(a => a.id === id && a.id !== originalId);
    if (isDuplicate) {
        showAlert(`Mã sân bay ${id} đã tồn tại trong hệ thống.`, 'error');
        return;
    }

    // Giả lập lỗi hệ thống (Luồng phụ 23.4)
    if (Math.random() < 0.05) { // 5% xác suất xảy ra lỗi DB
        showAlert('Không thể lưu dữ liệu vào lúc này. Vui lòng thử lại sau.', 'error');
        return;
    }

    if (currentAction === 'add') {
        airports.push({ id, name, city, country, status });
        showAlert('Thêm sân bay mới thành công!', 'success');
        closeForm();
        renderTable();
    } else {
        const index = airports.findIndex(a => a.id === originalId);
        if (index !== -1) {
            airports[index] = { id, name, city, country, status };
            showAlert('Cập nhật thông tin sân bay thành công!', 'success');
            closeForm();
            renderTable();
        }
    }
}

// Mở Modal Xác nhận xóa
function openDeleteModal(airportId) {
    hideAlert();
    airportToDelete = airportId;
    document.getElementById('delete-airport-code').textContent = airportId;
    document.getElementById('delete-modal').classList.add('show');
}

// Đóng Modal Xóa (Luồng phụ 23.3)
function closeDeleteModal() {
    airportToDelete = null;
    document.getElementById('delete-modal').classList.remove('show');
}

// Xác nhận Xóa (Luồng phụ 23.2)
function confirmDelete() {
    if (!airportToDelete) return;

    // Giả lập Luồng phụ 23.2: Tồn tại ràng buộc (ví dụ sân bay SGN và HAN đang được sử dụng trong chuyến bay/tuyến bay)
    if (airportToDelete === 'SGN' || airportToDelete === 'HAN') {
        showAlert('Không thể xóa sân bay đang được sử dụng trong hệ thống.', 'error');
        closeDeleteModal();
        return;
    }

    // Luồng chính: Thực hiện xóa (hoặc chuyển trạng thái ngừng hoạt động)
    // Theo Use case: Xóa hoặc chuyển trạng thái sân bay sang "Ngừng hoạt động".
    // Ở đây ta chọn cách xóa khỏi mảng để demo.
    airports = airports.filter(a => a.id !== airportToDelete);
    
    showAlert(`Đã xóa thành công sân bay ${airportToDelete}.`, 'success');
    closeDeleteModal();
    renderTable();
}
