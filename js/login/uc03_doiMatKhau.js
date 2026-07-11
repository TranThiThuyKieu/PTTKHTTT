let wrongAttempt = 0;
function handleChangePassword(e) {
    e.preventDefault();
    const currentPassword = document.getElementById("current-password").value;
    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const errorBox = document.getElementById("error-message");
    const successBox = document.getElementById("success-message");
    errorBox.style.display = "none";
    successBox.style.display = "none";
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    const oldPassword = "Admin123@";
    if (currentPassword !== oldPassword) {
        wrongAttempt++;
        if (wrongAttempt > 5) {
            alert("Tài khoản tạm thời bị khóa trong 15 phút.");
            return;
        }
        showError(`Mật khẩu hiện tại không chính xác. Còn ${5 - wrongAttempt} lần thử.`);
        return;
    }
    if (!passwordRegex.test(newPassword)) {
        showError("Mật khẩu mới phải có ít nhất 8 ký tự, chứa chữ hoa và chữ số.");
        return;
    }
    if (newPassword !== confirmPassword) {
        showError("Mật khẩu xác nhận không trùng khớp.");
        return;
    }
    if (currentPassword === newPassword) {
        showError("Mật khẩu mới không được trùng với mật khẩu hiện tại.");
        return;
    }
    successBox.innerText = "Đổi mật khẩu thành công.";
    successBox.style.display = "block";
    document.getElementById("change-password-form").reset();
}
function showError(message) {
    const errorBox = document.getElementById("error-message");
    errorBox.innerText = message;
    errorBox.style.display = "block";
}
function handleExit() {
    if (confirm("Bạn có chắc chắn muốn thoát khỏi chức năng đổi mật khẩu không?")) {
        window.history.back();
    }
}