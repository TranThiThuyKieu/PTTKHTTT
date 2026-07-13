document.addEventListener('DOMContentLoaded', () => {
    Promise.all([
        fetch('../user/header.html').then(response => response.text()),
        fetch('../user/footer.html').then(response => response.text())
    ])
        .then(([headerHtml, footerHtml]) => {
            document.getElementById('header').innerHTML = headerHtml;
            document.getElementById('footer').innerHTML = footerHtml;
            if (typeof initHeader === 'function') initHeader();
        })
        .catch(error => console.error('Không thể tải header/footer:', error));

    const historyData = [
        { title: 'Đặt vé Hà Nội - Đà Nẵng', meta: '15/07/2026 · Chuyến bay VN8899', points: '+450', icon: 'fa-plane' },
        { title: 'Đánh giá chuyến bay', meta: '10/07/2026 · Phản hồi khách hàng', points: '+120', icon: 'fa-star' },
        { title: 'Mua gói ưu tiên', meta: '02/07/2026 · Dịch vụ gia tăng', points: '+200', icon: 'fa-ticket' },
        { title: 'Đổi ưu đãi vé tháng 7', meta: '28/06/2026 · Khuyến mãi thành viên', points: '-180', icon: 'fa-gift' }
    ];

    const historyList = document.getElementById('historyList');
    historyList.innerHTML = historyData.map(item => `
        <article class="history-item">
            <div class="history-main">
                <div class="history-icon">
                    <i class="fa-solid ${item.icon}"></i>
                </div>
                <div>
                    <div class="history-title">${item.title}</div>
                    <span class="history-meta">${item.meta}</span>
                </div>
            </div>
            <div class="history-points">${item.points}</div>
        </article>
    `).join('');
});
