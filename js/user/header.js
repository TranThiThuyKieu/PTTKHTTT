function initHeader() {
    const authSection = document.querySelector('.header-right');
    if (!authSection) return;
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
        authSection.innerHTML = `
                <a href="uc07_quanLyVeDaDat.html" class="auth-link">Vé đã đặt</a>
                <span class="divider">|</span>
                <a href="../login/uc18_dangNhap.html" class="auth-link" onclick="handleLogout(event)">Đăng xuất</a>
            `;
    } else {
        authSection.innerHTML = `
                <a href="../login/uc18_dangNhap.html" class="auth-link">Đăng nhập</a>
                <span class="divider">|</span>
                <a href="../login/uc01_dangKy.html" class="auth-link">Đăng ký</a>
            `;
    }
}

document.addEventListener("DOMContentLoaded", function() {
    initHeader();
});

function handleLogout(event) {
    event.preventDefault();
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'trangChu.html';
}
