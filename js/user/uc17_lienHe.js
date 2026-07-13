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
});

// Giả lập cơ sở dữ liệu lưu trữ các yêu cầu
let submittedRequests = [
    { email: 'test@gmail.com', subject: 'Tư vấn đặt vé', status: 'pending' } // Dữ liệu mẫu để test luồng 17.2
];

function showAlert(message, type = 'error') {
    const alertEl = document.getElementById('alert-message');
    const icon = type === 'error' ? '<i class="fa-solid fa-circle-exclamation"></i>' : 
                 type === 'success' ? '<i class="fa-solid fa-circle-check"></i>' : 
                 '<i class="fa-solid fa-triangle-exclamation"></i>';
    alertEl.innerHTML = `${icon} <span>${message}</span>`;
    alertEl.className = `alert alert-${type}`;
    alertEl.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Tự động ẩn nếu là success
    if(type === 'success') {
        setTimeout(() => alertEl.classList.add('hidden'), 5000);
    }
}

function hideAlert() {
    document.getElementById('alert-message').classList.add('hidden');
}

function submitForm(event) {
    event.preventDefault(); // Ngăn trình duyệt reload
    hideAlert();

    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const subject = document.getElementById('subject').value;
    const content = document.getElementById('content').value.trim();

    // Luồng phụ 17.1: Dữ liệu nhập vào không hợp lệ
    if (!fullname) {
        return showAlert('Luồng 17.1: Vui lòng nhập họ và tên của bạn.', 'error');
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        return showAlert('Luồng 17.1: Vui lòng nhập địa chỉ email hợp lệ.', 'error');
    }
    if (!subject) {
        return showAlert('Luồng 17.1: Vui lòng chọn chủ đề liên hệ.', 'error');
    }
    if (!content || content.length < 10) {
        return showAlert('Luồng 17.1: Nội dung câu hỏi quá ngắn. Vui lòng nhập tối thiểu 10 ký tự.', 'error');
    }

    // Luồng phụ 17.2: Khách hàng gửi yêu cầu trùng lặp
    // Kiểm tra xem đã có yêu cầu nào của email này, cùng chủ đề và trạng thái 'pending' chưa
    const isDuplicate = submittedRequests.some(req => 
        req.email === email && req.subject === subject && req.status === 'pending'
    );
    if (isDuplicate) {
        return showAlert('Luồng 17.2: Yêu cầu này của bạn đã được ghi nhận và đang chờ phản hồi. Vui lòng không gửi trùng lặp.', 'warning');
    }

    // Luồng phụ 17.3: Lỗi hệ thống khi lưu
    // Giả lập 5% tỷ lệ lỗi CSDL
    if (Math.random() < 0.05) { 
        return showAlert('Luồng 17.3: Không thể gửi yêu cầu vào lúc này do lỗi hệ thống. Vui lòng thử lại sau.', 'error');
    }

    // Nếu qua hết các bước kiểm tra, tiến hành lưu dữ liệu
    submittedRequests.push({ email, subject, status: 'pending' });

    // Luồng phụ 17.4: Gửi Email/SMS xác nhận thất bại
    // Giả lập 10% tỷ lệ lỗi gửi Email
    if (Math.random() < 0.1) { 
        showAlert('Luồng 17.4: Yêu cầu đã được tiếp nhận thành công. Tuy nhiên việc gửi email xác nhận đang bị gián đoạn, hệ thống sẽ gửi lại sau.', 'warning');
        document.getElementById('contact-form').reset(); // Vẫn xóa form vì đã lưu thành công
        return;
    }

    // Luồng chính: Thành công toàn bộ
    showAlert('Gửi yêu cầu thành công! Chúng tôi đã nhận được thông tin và gửi một email xác nhận đến bạn.', 'success');
    document.getElementById('contact-form').reset();
}

function cancelForm() {
    // Luồng phụ 17.5: Khách hàng hủy quá trình
    if(confirm('Bạn có chắc chắn muốn hủy quá trình gửi yêu cầu? Các thông tin bạn vừa nhập sẽ bị xóa bỏ.')) {
        document.getElementById('contact-form').reset();
        hideAlert();
    }
}
