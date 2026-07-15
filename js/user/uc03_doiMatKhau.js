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

    document.getElementById('change-password-form').addEventListener('submit', handleChangePassword);
});

const MOCK_CURRENT_PASSWORD = "Password123";
let failedAttempts = 0;
let isAccountLocked = false;
let lockTimeout = null;
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling;
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}
function showAlert(message, type) {
    const alertEl = document.getElementById('alert-message');
    alertEl.innerHTML = message;
    alertEl.className = `alert alert-${type}`;
    alertEl.classList.remove('hidden');
}
function hideAlert() {
    const alertEl = document.getElementById('alert-message');
    alertEl.classList.add('hidden');
}
function validateNewPassword(password) {
    if (password.length < 8) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/[0-9]/.test(password)) return false;
    return true;
}
function cancelChange() {
    document.getElementById('change-password-form').reset();
    hideAlert();
    window.location.href = '../../index.html';
}
function handleChangePassword(e) {
    e.preventDefault();
    hideAlert();
    if (isAccountLocked) {
        showAlert("Tài khoản của bạn đang bị khóa tạm thời. Vui lòng thử lại sau.", "error");
        return;
    }
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    if (!validateNewPassword(newPassword)) {
        showAlert("Mật khẩu mới không hợp lệ (cần ít nhất 8 ký tự, 1 chữ hoa, 1 chữ số).", "error");
        return;
    }
    if (newPassword !== confirmPassword) {
        showAlert("Xác nhận mật khẩu không trùng khớp với mật khẩu mới.", "error");
        return;
    }
    if (currentPassword !== MOCK_CURRENT_PASSWORD) {
        failedAttempts++;
        if (failedAttempts > 5) {
            isAccountLocked = true;
            showAlert("Tài khoản tạm thời bị khóa do nhập sai mật khẩu quá 5 lần. Tự động đăng xuất...", "error");
            setTimeout(() => {
                window.location.href = '../../index.html';
            }, 3000);
            return;
        } else {
            showAlert(`Mật khẩu hiện tại không chính xác. Bạn đã nhập sai ${failedAttempts}/5 lần. Vui lòng thử lại.`, "error");
            return;
        }
    }
    if (newPassword === currentPassword) {
        showAlert("Mật khẩu mới không được trùng với mật khẩu hiện tại.", "error");
        return;
    }
    failedAttempts = 0;
    showAlert("Đổi mật khẩu thành công!", "success");
    document.getElementById('change-password-form').reset();
}
