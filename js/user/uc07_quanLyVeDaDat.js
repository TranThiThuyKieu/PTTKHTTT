const ticketListEl = document.getElementById('ticket-list');
const modalEl = document.getElementById('ticket-modal');
const modalBodyEl = document.getElementById('modal-body-content');
const mockTickets = [
    {
        id: "VN8899A",
        route: "Hà Nội (HAN) ➔ Đà Nẵng (DAD)",
        dateTime: "08:30 - 15/08/2026",
        status: "cho-bay",
        statusLabel: "Chờ bay",
        passenger: "Nguyễn Văn A",
        flightNo: "VN123",
        class: "Phổ thông",
        seat: "12A",
        services: "Hành lý 20kg, Suất ăn nhẹ"
    },
    {
        id: "VJ4567B",
        route: "TP. Hồ Chí Minh (SGN) ➔ Phú Quốc (PQC)",
        dateTime: "14:15 - 01/07/2026",
        status: "da-bay",
        statusLabel: "Đã bay",
        passenger: "Nguyễn Văn A",
        flightNo: "VJ456",
        class: "Thương gia",
        seat: "02B",
        services: "Hành lý 30kg, Suất ăn cao cấp, Phòng chờ VIP"
    },
    {
        id: "BB1122C",
        route: "Đà Nẵng (DAD) ➔ Hà Nội (HAN)",
        dateTime: "09:00 - 10/05/2026",
        status: "da-huy",
        statusLabel: "Đã hủy",
        passenger: "Nguyễn Văn A",
        flightNo: "QH789",
        class: "Phổ thông",
        seat: "15C",
        services: "Không có"
    }
];
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
    renderTickets();
});
function renderTickets() {
    ticketListEl.innerHTML = '';
    ticketListEl.classList.remove('hidden');

    mockTickets.forEach(ticket => {
        const card = document.createElement('div');
        card.className = `ticket-card status-${ticket.status}`;
        card.onclick = () => openTicketDetails(ticket.id);

        card.innerHTML = `
            <div class="ticket-info">
                <div class="ticket-code">Mã Đặt Chỗ: ${ticket.id}</div>
                <div class="ticket-route">${ticket.route}</div>
                <div class="ticket-date"><i class="fa-regular fa-clock"></i> ${ticket.dateTime}</div>
            </div>
            <div class="ticket-status status-badge-${ticket.status}">
                ${ticket.statusLabel}
            </div>
        `;
        ticketListEl.appendChild(card);
    });
}
function openTicketDetails(ticketId) {
    const ticket = mockTickets.find(t => t.id === ticketId);
    if (!ticket) return;
    modalBodyEl.innerHTML = `
        <div class="detail-row">
            <span class="detail-label">Mã đặt chỗ</span>
            <span class="detail-value detail-highlight">${ticket.id}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Chặng bay</span>
            <span class="detail-value">${ticket.route}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Ngày giờ bay</span>
            <span class="detail-value">${ticket.dateTime}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Trạng thái</span>
            <span class="detail-value status-badge-${ticket.status}" style="padding: 4px 8px; border-radius: 12px; font-size: 12px;">${ticket.statusLabel}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Tên hành khách</span>
            <span class="detail-value">${ticket.passenger}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Số hiệu chuyến bay</span>
            <span class="detail-value">${ticket.flightNo}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Hạng ghế / Số ghế</span>
            <span class="detail-value">${ticket.class} / ${ticket.seat}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Dịch vụ bổ sung</span>
            <span class="detail-value">${ticket.services}</span>
        </div>
        ${ticket.status === 'cho-bay' ? `
        <div class="modal-actions" style="margin-top: 20px; text-align: right; border-top: 1px solid var(--border-color, #cbd5e1); padding-top: 15px;">
            <button class="btn btn-primary" onclick="window.location.href='uc12_doiChuyenBay.html'" style="padding: 10px 20px; background-color: var(--primary-color, #1d4ed8); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">Đổi chuyến bay</button>
        </div>
        ` : ''}
    `;
    modalEl.classList.remove('hidden');
}
function closeModal() {
    modalEl.classList.add('hidden');
}
