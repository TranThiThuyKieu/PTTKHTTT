function initHeader() {
    const authSection = document.querySelector('.header-right');
    if (!authSection) return;
    const isVourcher = window.location.pathname.includes('/vourcher/');
    const userPrefix = isVourcher ? '../user/' : '';
    const vourcherPrefix = isVourcher ? '' : '../vourcher/';
    const loginPrefix = '../login/';
    const staticLinks = document.querySelectorAll('.header-left a, .header-center a');
    staticLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http') && !href.startsWith('#') && !href.includes('/')) {
            link.setAttribute('href', userPrefix + href);
        }
    });
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
        authSection.innerHTML = `
            <div class="user-menu">
                <button class="user-avatar-btn" onclick="toggleUserMenu(event)">
                    <i class="fa-solid fa-user"></i>
                </button>
                <div class="user-dropdown" id="user-dropdown">
                    <div class="dropdown-header">
                        <i class="fa-solid fa-circle-user"></i>
                        <span>Xin chào, <strong>Người dùng</strong></span>
                    </div>
                    <div class="dropdown-divider"></div>
                    <div class="dropdown-group-label">Tài khoản</div>
                    <a href="${vourcherPrefix}uc04_capNhatThongTinCaNhan.html" class="dropdown-item">
                        <i class="fa-solid fa-user-pen"></i> Cập nhật thông tin cá nhân
                    </a>
                    <a href="${vourcherPrefix}uc05_06_xemDiemTichLuy.html" class="dropdown-item">
                        <i class="fa-solid fa-coins"></i> Xem điểm tích lũy
                    </a>
                    <a href="${userPrefix}uc03_doiMatKhau.html" class="dropdown-item">
                        <i class="fa-solid fa-key"></i> Đổi mật khẩu
                    </a>
                    <div class="dropdown-divider"></div>
                    <div class="dropdown-group-label">Quản lý vé</div>
                    <a href="${userPrefix}uc07_quanLyVeDaDat.html" class="dropdown-item">
                        <i class="fa-solid fa-ticket"></i> Vé đã đặt
                    </a>
                    <div class="dropdown-divider"></div>
                    <div class="dropdown-group-label">Hỗ trợ</div>
                    <a href="${vourcherPrefix}uc21_uuDaiTuyenBay.html" class="dropdown-item">
                        <i class="fa-solid fa-gift"></i> Ưu đãi chuyến bay
                    </a>
                    <a href="${vourcherPrefix}uc14_khieuNaiChuyenBay.html" class="dropdown-item">
                        <i class="fa-solid fa-headset"></i> Khiếu nại chuyến bay
                    </a>
                    <div class="dropdown-divider"></div>
                    <a href="#" class="dropdown-item dropdown-logout" onclick="handleLogout(event)">
                        <i class="fa-solid fa-right-from-bracket"></i> Đăng xuất
                    </a>
                </div>
            </div>
        `;
    } else {
        authSection.innerHTML = `
            <a href="${loginPrefix}uc18_dangNhap.html" class="auth-link">Đăng nhập</a>
            <span class="divider">|</span>
            <a href="${loginPrefix}uc01_dangKy.html" class="auth-link">Đăng ký</a>
        `;
    }
}

document.addEventListener("DOMContentLoaded", function() {
    initHeader();
});

function toggleUserMenu(event) {
    event.stopPropagation();
    var dropdown = document.getElementById('user-dropdown');
    if (dropdown) dropdown.classList.toggle('show');
}

document.addEventListener('click', function() {
    var dropdown = document.getElementById('user-dropdown');
    if (dropdown && dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
    }
});
function handleLogout(event) {
    event.preventDefault();
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('role');
    const isVourcher = window.location.pathname.includes('/vourcher/');
    window.location.href = isVourcher ? '../user/trangChu.html' : 'trangChu.html';
}
