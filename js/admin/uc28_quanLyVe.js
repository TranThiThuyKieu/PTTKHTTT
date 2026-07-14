let tickets = [
    { id: 1, code: 'TKT-VN123-ECO', flight: 'VN123', seatClass: 'Phổ thông', price: 1500000, total: 150, sold: 120, baggage: '7kg xách tay + 20kg ký gửi' },
    { id: 2, code: 'TKT-VN123-BUS', flight: 'VN123', seatClass: 'Thương gia', price: 4500000, total: 20, sold: 15, baggage: '10kg xách tay + 30kg ký gửi' },
    { id: 3, code: 'TKT-VJ456-ECO', flight: 'VJ456', seatClass: 'Phổ thông', price: 900000, total: 180, sold: 180, baggage: '7kg xách tay' },
    { id: 4, code: 'TKT-QH789-ECO', flight: 'QH789', seatClass: 'Phổ thông', price: 1200000, total: 100, sold: 0, baggage: '7kg xách tay' },
];

let editingId = null;
let deletingId = null;

document.addEventListener("DOMContentLoaded", () => {
    renderTable();
});

function updateStats() {
    let total = 0;
    let sold = 0;
    let unsold = 0;
    
    tickets.forEach(t => {
        total += parseInt(t.total);
        sold += parseInt(t.sold);
    });
    
    unsold = total - sold;
    
    document.getElementById('stat-total').textContent = total.toLocaleString('vi-VN');
    document.getElementById('stat-sold').textContent = sold.toLocaleString('vi-VN');
    document.getElementById('stat-unsold').textContent = unsold.toLocaleString('vi-VN');
}

function renderTable() {
    const tbody = document.getElementById('ticket-table-body');
    tbody.innerHTML = '';

    tickets.forEach(ticket => {
        const tr = document.createElement('tr');
        const formatPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(ticket.price);
        const classBadge = ticket.seatClass === 'Thương gia' ? 'badge-bus' : 'badge-eco';
        const unsold = ticket.total - ticket.sold;
        
        tr.innerHTML = `
            <td><strong>${ticket.code}</strong></td>
            <td><i class="fa-solid fa-plane" style="color: #6c757d; margin-right: 5px;"></i> ${ticket.flight}</td>
            <td><span class="badge ${classBadge}">${ticket.seatClass}</span></td>
            <td style="font-weight: 600;">${formatPrice}</td>
            <td class="text-center">${ticket.total}</td>
            <td class="text-center text-success">${ticket.sold}</td>
            <td class="text-center text-warning">${unsold}</td>
            <td class="text-center">
                <button class="btn btn-primary btn-action" onclick="openForm('edit', ${ticket.id})"><i class="fa-solid fa-pen"></i></button>
                <button class="btn btn-danger btn-action" onclick="openDeleteModal(${ticket.id})"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    updateStats();
}

function showAlert(type, message) {
    const alertBox = document.getElementById('alert-message');
    alertBox.className = `alert alert-${type}`;
    const icon = type === 'success' ? 'circle-check' : 'circle-exclamation';
    alertBox.innerHTML = `<i class="fa-solid fa-${icon}"></i> ${message}`;
    alertBox.style.display = 'flex';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 5000);
}

function openForm(action, id = null) {
    const modal = document.getElementById('ticket-modal');
    const form = document.getElementById('ticket-form');
    
    if (action === 'add') {
        editingId = null;
        document.getElementById('modal-title').textContent = 'Thêm cấu hình vé mới';
        form.reset();
        document.getElementById('ticket-code').readOnly = false;
    } else if (action === 'edit') {
        editingId = id;
        document.getElementById('modal-title').textContent = 'Cập nhật thông tin vé';
        
        const ticket = tickets.find(t => t.id === id);
        if (ticket) {
            document.getElementById('ticket-code').value = ticket.code;
            document.getElementById('ticket-code').readOnly = true; // Không cho sửa mã
            document.getElementById('flight-code').value = ticket.flight;
            document.getElementById('seat-class').value = ticket.seatClass;
            document.getElementById('ticket-price').value = ticket.price;
            document.getElementById('total-quantity').value = ticket.total;
            document.getElementById('baggage').value = ticket.baggage;
        }
    }
    
    modal.classList.add('active');
}

function closeForm() {
    document.getElementById('ticket-modal').classList.remove('active');
}

function saveTicket() {
    // Validate
    const code = document.getElementById('ticket-code').value;
    const flight = document.getElementById('flight-code').value;
    const seatClass = document.getElementById('seat-class').value;
    const price = parseInt(document.getElementById('ticket-price').value);
    const total = parseInt(document.getElementById('total-quantity').value);
    const baggage = document.getElementById('baggage').value;

    if (!code || !flight || isNaN(price) || isNaN(total)) {
        showAlert('danger', 'Vui lòng nhập đầy đủ các thông tin bắt buộc.');
        return;
    }

    // Alternative Flow 18.1: Dữ liệu cấu hình vé không hợp lệ
    if (price < 0) {
        showAlert('danger', 'Lỗi: Giá vé không được là số âm.');
        return; // Dừng luồng, giữ nguyên form
    }
    
    // Giả sử tổng số ghế của máy bay lớn nhất là 200
    if (total > 200) {
        showAlert('danger', 'Lỗi: Số lượng vé phát hành vượt quá giới hạn sơ đồ ghế của máy bay (Tối đa 200).');
        return; // Dừng luồng
    }

    if (editingId) {
        // Cập nhật
        const index = tickets.findIndex(t => t.id === editingId);
        
        // Kiểm tra logic: không thể sửa số lượng nhỏ hơn số vé đã bán
        if (total < tickets[index].sold) {
            showAlert('danger', `Lỗi: Số lượng phát hành (${total}) không được nhỏ hơn số vé đã bán (${tickets[index].sold}).`);
            return;
        }
        
        tickets[index] = {
            ...tickets[index],
            flight, seatClass, price, total, baggage
        };
        showAlert('success', 'Đã cập nhật thông tin cấu hình vé thành công.');
    } else {
        // Thêm mới
        // Kiểm tra trùng mã vé
        if (tickets.some(t => t.code === code)) {
            showAlert('danger', 'Mã vé này đã tồn tại trong hệ thống.');
            return;
        }
        
        const newId = tickets.length ? Math.max(...tickets.map(t => t.id)) + 1 : 1;
        tickets.push({
            id: newId,
            code, flight, seatClass, price, total, sold: 0, baggage
        });
        showAlert('success', 'Đã thêm cấu hình vé mới thành công.');
    }

    closeForm();
    renderTable();
}

function openDeleteModal(id) {
    const ticket = tickets.find(t => t.id === id);
    if (!ticket) return;

    // Alternative Flow 18.2: Kiểm tra trạng thái vé trước khi xóa
    if (ticket.sold > 0) {
        showAlert('danger', `Lỗi: Hệ thống từ chối xóa vì mã vé ${ticket.code} đã có khách hàng thanh toán (${ticket.sold} vé đã bán).`);
        return; // Từ chối xóa
    }

    deletingId = id;
    document.getElementById('delete-ticket-code').textContent = ticket.code;
    document.getElementById('delete-modal').classList.add('active');
}

function closeDeleteModal() {
    document.getElementById('delete-modal').classList.remove('active');
    deletingId = null;
}

function confirmDelete() {
    if (deletingId) {
        tickets = tickets.filter(t => t.id !== deletingId);
        showAlert('success', 'Đã xóa cấu hình vé thành công.');
        closeDeleteModal();
        renderTable();
    }
}
