// Dữ liệu mẫu (Mock Data)
let users = [
    { id: 'U001', name: 'Nguyễn Văn A', email: 'nguyenvana@gmail.com', phone: '0901234567', role: 'admin', status: 'active', version: 1 },
    { id: 'U002', name: 'Trần Thị B', email: 'tranthib@gmail.com', phone: '0912345678', role: 'coordinator', status: 'active', version: 1 },
    { id: 'U003', name: 'Lê Văn C', email: 'levanc@gmail.com', phone: '0923456789', role: 'customer', status: 'locked', version: 1 },
    { id: 'U004', name: 'Phạm Thị D', email: 'phamthid@gmail.com', phone: '0934567890', role: 'customer', status: 'active', version: 1 }
];

const roleMap = {
    'admin': 'Quản trị viên',
    'coordinator': 'Nhân viên điều phối',
    'customer': 'Khách hàng'
};

let userToLock = null;
let lockAction = 'lock'; // 'lock' hoặc 'unlock'
let currentSearch = '';

// Khởi tạo
document.addEventListener('DOMContentLoaded', () => {
    renderTable();
});

// Render Bảng Người dùng
function renderTable() {
    const tbody = document.getElementById('user-table-body');
    tbody.innerHTML = '';
    
    // Lọc theo tìm kiếm
    const filteredUsers = users.filter(user => {
        const searchLower = currentSearch.toLowerCase();
        return user.name.toLowerCase().includes(searchLower) ||
               user.email.toLowerCase().includes(searchLower) ||
               user.phone.includes(searchLower) ||
               user.id.toLowerCase().includes(searchLower);
    });

    if (filteredUsers.length === 0) {
        if (currentSearch !== '') {
            // Luồng phụ 20.2: Không tìm thấy người dùng
            tbody.innerHTML = '<tr><td colspan="7" class="text-center" style="padding: 30px;">Không tìm thấy người dùng phù hợp.</td></tr>';
        } else {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center" style="padding: 30px;">Không có dữ liệu.</td></tr>';
        }
        return;
    }

    filteredUsers.forEach(user => {
        const tr = document.createElement('tr');
        
        const statusBadge = user.status === 'active' 
            ? '<span class="badge badge-active"><i class="fa-solid fa-check-circle"></i> Đang hoạt động</span>' 
            : '<span class="badge badge-inactive"><i class="fa-solid fa-lock"></i> Đã khóa</span>';

        const roleBadgeClass = user.role === 'admin' ? 'badge-role-admin' : 'badge-role';
        const roleBadge = `<span class="badge ${roleBadgeClass}">${roleMap[user.role]}</span>`;

        const lockBtnIcon = user.status === 'active' ? 'fa-lock' : 'fa-unlock';
        const lockBtnTitle = user.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản';
        const lockBtnClass = user.status === 'active' ? 'btn-warning' : 'btn-success';

        tr.innerHTML = `
            <td><strong>${user.id}</strong></td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${roleBadge}</td>
            <td>${statusBadge}</td>
            <td class="action-btns">
                <button class="btn btn-sm btn-secondary" onclick="openForm('${user.id}')" title="Cập nhật thông tin & Phân quyền">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="btn btn-sm ${lockBtnClass}" onclick="openLockModal('${user.id}', '${user.status}')" title="${lockBtnTitle}">
                    <i class="fa-solid ${lockBtnIcon}"></i>
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

// Chức năng Tìm kiếm (Luồng phụ 20.2)
function searchUser() {
    hideAlert();
    currentSearch = document.getElementById('search-input').value.trim();
    renderTable();
    
    // Check lại nếu rỗng thì có thể hiển thị thông báo
    const hasResults = users.some(user => {
        const searchLower = currentSearch.toLowerCase();
        return user.name.toLowerCase().includes(searchLower) ||
               user.email.toLowerCase().includes(searchLower) ||
               user.phone.includes(searchLower) ||
               user.id.toLowerCase().includes(searchLower);
    });

    if (!hasResults && currentSearch !== '') {
        showAlert('Không tìm thấy người dùng phù hợp.', 'error');
    }
}

function clearSearch() {
    hideAlert();
    document.getElementById('search-input').value = '';
    currentSearch = '';
    renderTable();
}

// Logic mở Form Cập nhật & Phân quyền
function openForm(userId) {
    hideAlert();
    const modal = document.getElementById('user-modal');
    const form = document.getElementById('user-form');
    
    form.reset(); // Xóa dữ liệu cũ (Luồng phụ 20.5)
    
    const user = users.find(u => u.id === userId);
    if (user) {
        document.getElementById('user-id').value = user.id;
        document.getElementById('original-email').value = user.email;
        document.getElementById('original-phone').value = user.phone;
        
        document.getElementById('user-name').value = user.name;
        document.getElementById('user-phone').value = user.phone;
        document.getElementById('user-email').value = user.email;
        document.getElementById('user-role').value = user.role;
        
        modal.classList.add('show');
    }
}

// Logic đóng Form (Luồng phụ 20.5: Người dùng hủy thao tác)
function closeForm() {
    document.getElementById('user-modal').classList.remove('show');
}

// Lưu Cập nhật (Luồng chính)
function saveUser() {
    const id = document.getElementById('user-id').value;
    const name = document.getElementById('user-name').value.trim();
    const phone = document.getElementById('user-phone').value.trim();
    const email = document.getElementById('user-email').value.trim();
    const role = document.getElementById('user-role').value;
    
    const originalEmail = document.getElementById('original-email').value;
    const originalPhone = document.getElementById('original-phone').value;

    // Luồng phụ 20.1: Dữ liệu cập nhật hoặc phân quyền không hợp lệ
    if (!name || !phone || !email || !role) {
        showAlert('Vui lòng nhập đầy đủ thông tin bắt buộc.', 'error');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showAlert('Email không đúng định dạng.', 'error');
        return;
    }

    const phoneRegex = /^[0-9]{10}$/; // Định dạng số điện thoại 10 số
    if (!phoneRegex.test(phone)) {
        showAlert('Số điện thoại không đúng định dạng.', 'error');
        return;
    }

    // Kiểm tra trùng lặp email/phone với user khác
    const isDuplicateEmail = users.some(u => u.email === email && u.id !== id);
    if (isDuplicateEmail) {
        showAlert('Email đã tồn tại trong hệ thống.', 'error');
        return;
    }

    const isDuplicatePhone = users.some(u => u.phone === phone && u.id !== id);
    if (isDuplicatePhone) {
        showAlert('Số điện thoại đã tồn tại trong hệ thống.', 'error');
        return;
    }

    // Luồng phụ 20.6: Lỗi hệ thống khi lưu
    if (Math.random() < 0.05) { // 5% xác suất xảy ra lỗi DB
        showAlert('Không thể thực hiện thao tác vào lúc này. Vui lòng thử lại sau.', 'error');
        return;
    }

    // Tiến hành cập nhật
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
        // Giả lập Luồng phụ 20.3: Xung đột dữ liệu
        // Nếu version ở client khác version ở server (do có ng khác đã sửa)
        // Để demo, ta lấy random 10% bị xung đột
        if (Math.random() < 0.1) {
            showAlert('Dữ liệu người dùng đã được cập nhật bởi người khác. Vui lòng tải lại và thực hiện lại thao tác.', 'error');
            closeForm();
            return;
        }

        // Cập nhật thành công
        users[index].name = name;
        users[index].phone = phone;
        users[index].email = email;
        users[index].role = role;
        users[index].version += 1;
        
        showAlert('Cập nhật thông tin người dùng thành công!', 'success');
        closeForm();
        renderTable();
    }
}

// Mở Modal Khóa/Mở Khóa
function openLockModal(userId, currentStatus) {
    hideAlert();
    userToLock = userId;
    lockAction = currentStatus === 'active' ? 'lock' : 'unlock';
    
    const title = lockAction === 'lock' ? 'Xác nhận khóa tài khoản' : 'Xác nhận mở khóa tài khoản';
    const message = lockAction === 'lock' 
        ? `Bạn có chắc chắn muốn khóa tài khoản người dùng <strong>${userId}</strong>?`
        : `Bạn có chắc chắn muốn mở khóa tài khoản người dùng <strong>${userId}</strong>?`;
    
    document.getElementById('lock-modal-title').textContent = title;
    document.getElementById('lock-modal-message').innerHTML = message;
    
    const confirmBtn = document.getElementById('btn-confirm-lock');
    if (lockAction === 'lock') {
        confirmBtn.textContent = 'Khóa tài khoản';
        confirmBtn.className = 'btn btn-danger';
        document.getElementById('lock-warning-text').style.display = 'block';
    } else {
        confirmBtn.textContent = 'Mở khóa';
        confirmBtn.className = 'btn btn-success';
        confirmBtn.style.background = '#10b981'; // Override màu đỏ
        document.getElementById('lock-warning-text').style.display = 'none';
    }

    document.getElementById('lock-modal').classList.add('show');
}

// Đóng Modal Khóa (Luồng phụ 20.5)
function closeLockModal() {
    userToLock = null;
    document.getElementById('lock-modal').classList.remove('show');
}

// Xác nhận Khóa/Mở Khóa
function confirmLock() {
    if (!userToLock) return;

    // Giả lập Luồng phụ 20.4: Không thể khóa tài khoản quản trị viên cuối cùng
    const user = users.find(u => u.id === userToLock);
    if (lockAction === 'lock' && user.role === 'admin') {
        // Kiểm tra xem có bao nhiêu admin đang active
        const activeAdmins = users.filter(u => u.role === 'admin' && u.status === 'active');
        if (activeAdmins.length <= 1) {
            showAlert('Không thể khóa tài khoản quản trị viên cuối cùng của hệ thống.', 'error');
            closeLockModal();
            return;
        }
    }

    // Giả lập Luồng phụ 20.6: Lỗi hệ thống khi lưu
    if (Math.random() < 0.05) { 
        showAlert('Không thể thực hiện thao tác vào lúc này. Vui lòng thử lại sau.', 'error');
        closeLockModal();
        return;
    }

    // Cập nhật trạng thái
    if (user) {
        user.status = lockAction === 'lock' ? 'locked' : 'active';
        showAlert(`Đã ${lockAction === 'lock' ? 'khóa' : 'mở khóa'} tài khoản ${userToLock} thành công.`, 'success');
        closeLockModal();
        renderTable();
    }
}
