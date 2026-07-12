// Toggle hiện/ẩn mật khẩu
function togglePassword() {
    const input = document.getElementById('password');
    const iconEye = document.getElementById('icon-eye');
    const iconEyeOff = document.getElementById('icon-eye-off');

    if (input.type === 'password') {
        input.type = 'text';
        iconEye.style.display = 'none';
        iconEyeOff.style.display = 'block';
    } else {
        input.type = 'password';
        iconEye.style.display = 'block';
        iconEyeOff.style.display = 'none';
    }
}

// Xử lý đăng nhập – chuyển đến trang chủ
function handleLogin(event) {
    event.preventDefault();
    localStorage.setItem('isLoggedIn', 'true');
    window.location.href = '../user/trangChu.html';
}
