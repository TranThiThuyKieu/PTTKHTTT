document.addEventListener("DOMContentLoaded", () => {
    // Tải header, footer
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
});

// Mock database vé đã đặt
const mockDB = [
    { pnr: 'VN8899A', email: 'test@gmail.com', route: 'Hà Nội (HAN) ➔ Đà Nẵng (DAD)', date: '08:30 - 15/08/2026', status: 'cho-bay', statusLabel: 'Chờ bay' },
    { pnr: 'VJ4567B', email: 'test@gmail.com', route: 'TP. Hồ Chí Minh (SGN) ➔ Phú Quốc (PQC)', date: '14:15 - 01/07/2026', status: 'da-bay', statusLabel: 'Đã hoàn thành' },
    { pnr: 'BB1122C', email: 'khach@gmail.com', route: 'Đà Nẵng (DAD) ➔ Hà Nội (HAN)', date: '09:00 - 10/05/2026', status: 'da-huy', statusLabel: 'Đã hủy' }
];

function showAlert(message, type = 'error') {
    const alertEl = document.getElementById('alert-message');
    const icon = type === 'error' ? '<i class="fa-solid fa-circle-exclamation"></i>' : '<i class="fa-solid fa-circle-info"></i>';
    alertEl.innerHTML = `${icon} <span>${message}</span>`;
    alertEl.className = `alert alert-${type}`;
    alertEl.classList.remove('hidden');
    document.getElementById('lookup-result').classList.add('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hideAlert() {
    document.getElementById('alert-message').classList.add('hidden');
}

function submitLookup(event) {
    event.preventDefault();
    hideAlert();
    document.getElementById('lookup-result').classList.add('hidden');

    const pnr = document.getElementById('pnr').value.trim().toUpperCase();
    const email = document.getElementById('email').value.trim();

    // Luồng phụ 15.1: Dữ liệu nhập không hợp lệ
    if (!pnr) {
        return showAlert('Luồng 15.1: Vui lòng nhập Mã đặt chỗ hoặc Mã vé.', 'error');
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        return showAlert('Luồng 15.1: Vui lòng nhập địa chỉ Email hợp lệ.', 'error');
    }

    // Luồng phụ 15.4: Lỗi hệ thống khi truy xuất dữ liệu (Giả lập 10%)
    if (Math.random() < 0.1) {
        return showAlert('Luồng 15.4: Không thể thực hiện tra cứu vào lúc này do lỗi kết nối hệ thống. Vui lòng thử lại sau.', 'error');
    }

    // Truy vấn dữ liệu
    const ticket = mockDB.find(t => t.pnr === pnr && t.email.toLowerCase() === email.toLowerCase());

    // Luồng phụ 15.2: Không tìm thấy vé hoặc thông tin email không khớp
    if (!ticket) {
        return showAlert('Luồng 15.2: Không tìm thấy thông tin vé phù hợp. Vui lòng kiểm tra lại Mã đặt chỗ và Email.', 'error');
    }

    // Nếu tìm thấy -> Hiển thị kết quả (Luồng chính)
    renderResult(ticket);

    // Luồng phụ 15.3: Vé đã hủy hoặc đã hoàn thành
    if (ticket.status === 'da-huy' || ticket.status === 'da-bay') {
        const alertEl = document.getElementById('alert-message');
        alertEl.innerHTML = `<i class="fa-solid fa-circle-info"></i> <span>Luồng 15.3: Vé tra cứu hiện đang ở trạng thái "${ticket.statusLabel}". Bạn vẫn có thể xem chi tiết thông tin.</span>`;
        alertEl.className = `alert alert-warning`;
        alertEl.classList.remove('hidden');
    }
}

function renderResult(ticket) {
    document.getElementById('res-pnr').textContent = `Mã Đặt Chỗ: ${ticket.pnr}`;
    document.getElementById('res-route').textContent = ticket.route;
    document.getElementById('res-date').textContent = ticket.date;

    const statusEl = document.getElementById('res-status');
    statusEl.textContent = ticket.statusLabel;
    statusEl.className = `ticket-status status-badge-${ticket.status}`;

    const card = document.getElementById('ticket-result-card');
    card.className = `ticket-card status-${ticket.status}`;

    document.getElementById('lookup-result').classList.remove('hidden');
}

function cancelLookup() {
    // Luồng phụ 15.5: Khách hàng hủy quá trình tra cứu
    if (confirm('Bạn có muốn hủy tra cứu và quay về trang chủ không?')) {
        window.location.href = '../../index.html';
    }
}

function viewDetails() {
    // Luồng chính kết thúc thành công -> Chuyển sang UC10: Xem chi tiết vé
    alert('Tra cứu thành công. Hệ thống chuyển hướng sang UC10 (Trang Xem chi tiết thông tin và trạng thái vé của mã đặt chỗ này).');

    // Ở hệ thống thực tế sẽ redirect hoặc open modal giống bên uc07_quanLyVeDaDat.html
    // window.location.href = 'uc07_quanLyVeDaDat.html?pnr=' + document.getElementById('pnr').value; 
}
