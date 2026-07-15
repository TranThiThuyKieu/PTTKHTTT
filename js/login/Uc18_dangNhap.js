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
    const contact = document.getElementById('contact').value.trim();
    const password = document.getElementById('password').value;
    const errorLogin = document.getElementById('error-login');
    if (errorLogin) {
        errorLogin.style.display = 'none';
    }
    if (contact === 'admin' && password === 'admin') {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('role', 'admin');
        window.location.href = '../admin/uc19_quanLyThongKe.html';
    } else if (contact === 'user' && password === 'user') {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('role', 'user');
        window.location.href = '../../index.html';
    } else {
        if (errorLogin) {
            errorLogin.style.display = 'block';
        } else {
            alert('Tài khoản hoặc mật khẩu không chính xác!');
        }
    }
}
