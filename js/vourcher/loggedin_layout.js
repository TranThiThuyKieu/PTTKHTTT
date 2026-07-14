// loggedin_layout.js — nguồn fetch DUY NHẤT cho header
fetch("../vourcher/header_logged.html")
    .then(response => {
        if (!response.ok) throw new Error("Header không tồn tại: " + response.status);
        return response.text();
    })
    .then(data => {
        document.getElementById('header').innerHTML = data;
        if (typeof initHeader === 'function') {
            initHeader();
        }
        setActiveNavLink();   // ← gọi ngay sau khi header đã có trong DOM
    })
    .catch(err => console.error("Lỗi tải header:", err));

fetch("../user/footer.html")
    .then(response => {
        if (!response.ok) throw new Error("Footer không tồn tại: " + response.status);
        return response.text();
    })
    .then(data => {
        document.getElementById('footer').innerHTML = data;
    })
    .catch(err => console.error("Lỗi tải footer:", err));

// Đánh dấu link đang active dựa trên tên file trang hiện tại
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop();
    const allLinks = document.querySelectorAll('.header-center a, .user-dropdown-menu a');
    allLinks.forEach(link => {
        const href = link.getAttribute('href');
        const hrefFileName = href ? href.split('/').pop() : '';
        link.classList.toggle('active', hrefFileName === currentPage);
    });
}