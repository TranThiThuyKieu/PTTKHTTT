document.addEventListener("DOMContentLoaded", () => {
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;
            if (typeof initHeader === 'function') {
                initHeader();
            }
        });
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer').innerHTML = data;
        });
    const cancelReasonSelect = document.getElementById('cancel-reason');
    const otherReasonGroup = document.getElementById('other-reason-group');
    const otherReasonTextarea = document.getElementById('other-reason');
    cancelReasonSelect.addEventListener('change', function() {
        if (this.value === 'khac') {
            otherReasonGroup.classList.remove('hidden');
            otherReasonTextarea.required = true;
        } else {
            otherReasonGroup.classList.add('hidden');
            otherReasonTextarea.required = false;
            otherReasonTextarea.value = '';
        }
    });
    document.getElementById('cancel-ticket-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const reason = cancelReasonSelect.value;
        if (!reason) {
            showAlert("Vui lòng chọn lý do hủy vé.", "error");
            return;
        }
        const formContainer = document.querySelector('.form-container');
        formContainer.innerHTML = `
            <div style="text-align: center; padding: 40px 20px;">
                <i class="fa-solid fa-circle-check" style="font-size: 60px; color: #10b981; margin-bottom: 20px;"></i>
                <h2 style="color: #1a2b4c; margin-bottom: 15px;">Gửi yêu cầu hủy vé thành công!</h2>
                <p style="color: #666; margin-bottom: 30px; line-height: 1.6;">Chúng tôi đã tiếp nhận yêu cầu hủy vé của bạn. Thông báo xác nhận và thông tin hoàn tiền (nếu có) sẽ được gửi vào email của bạn trong thời gian sớm nhất.</p>
                <button class="btn btn-primary" onclick="window.location.href='uc07_quanLyVeDaDat.html'">Quay lại Quản lý vé</button>
            </div>
        `;
    });
});
function showAlert(message, type) {
    const alertEl = document.getElementById('alert-message');
    alertEl.innerHTML = message;
    alertEl.className = `alert alert-${type}`;
    alertEl.classList.remove('hidden');
}
