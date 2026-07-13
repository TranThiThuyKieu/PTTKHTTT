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

    const benefits = [
        { title: 'Giảm 10% phí hành lý', detail: 'Áp dụng cho chuyến bay trong tháng', points: '1.500 điểm' },
        { title: 'Ưu tiên check-in', detail: 'Dành cho hạng thành viên Vàng trở lên', points: '800 điểm' },
        { title: 'Miễn phí đổi chuyến', detail: 'Tối đa 1 lần mỗi hành trình', points: '2.000 điểm' }
    ];

    document.getElementById('benefitsList').innerHTML = benefits.map(item => `
        <article class="benefit-item">
            <div class="benefit-main">
                <strong>${item.title}</strong>
                <span>${item.detail}</span>
            </div>
            <div class="benefit-action">
                <em>${item.points}</em>
                <button type="button" class="swap-btn">Đổi</button>
            </div>
        </article>
    `).join('');

    const historyData = [
        { title: 'Đặt vé chuyến bay Hà Nội - Đà Nẵng', detail: '15/07/2026 · Tích 450 điểm', points: '+450' },
        { title: 'Đánh giá chuyến bay', detail: '10/07/2026 · Tích 120 điểm', points: '+120' },
        { title: 'Đổi ưu đãi tháng 7', detail: '02/07/2026 · Trừ 180 điểm', points: '-180' }
    ];

    document.getElementById('historyList').innerHTML = historyData.map(item => `
        <article class="history-item">
            <div>
                <strong>${item.title}</strong>
                <span>${item.detail}</span>
            </div>
            <em>${item.points}</em>
        </article>
    `).join('');

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`${btn.dataset.tab}Panel`).classList.add('active');
        });
    });
});
