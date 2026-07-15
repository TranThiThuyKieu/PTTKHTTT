document.addEventListener("DOMContentLoaded", () => {
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;
            if (typeof initHeader === 'function') initHeader();
        });
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer').innerHTML = data;
        });

    renderSeatMap();
});

let currentStep = 1;
let selectedClass = 'eco';
let selectedSeat = null;
let basePrice = 1500000;
let servicesPrice = 0;
let discount = 0;
let promoApplied = false;

function showAlert(message, type = 'error') {
    const alertEl = document.getElementById('alert-message');
    const icon = type === 'error' ? '<i class="fa-solid fa-circle-exclamation"></i>' :
        type === 'success' ? '<i class="fa-solid fa-circle-check"></i>' :
            '<i class="fa-solid fa-triangle-exclamation"></i>';
    alertEl.innerHTML = `${icon} <span>${message}</span>`;
    alertEl.className = `alert alert-${type}`;
    alertEl.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hideAlert() {
    document.getElementById('alert-message').classList.add('hidden');
}

function showStep(stepNumber) {
    document.querySelectorAll('.step-section').forEach(el => el.classList.add('hidden'));
    document.getElementById('step-' + stepNumber).classList.remove('hidden');
    currentStep = stepNumber;
    hideAlert();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prevStep(stepNumber) {
    showStep(stepNumber);
}

let occupiedSeats = [];

function generateOccupiedSeats(rows, colsArr) {
    if (selectedClass === 'eco') {
        occupiedSeats = ['1A', '1C', '2B', '3E', '4D', '5A', '5F', '6C'];
    } else {
        occupiedSeats = ['1B', '2A', '3E'];
    }
}

function selectClass(cls) {
    document.querySelectorAll('.class-card').forEach(el => el.classList.remove('selected'));
    if (cls === 'eco') {
        document.querySelector('.class-card:nth-child(1)').classList.add('selected');
        document.getElementById('current-class-label').textContent = 'Phổ thông';
        basePrice = 1500000;
    } else {
        document.querySelector('.class-card:nth-child(2)').classList.add('selected');
        document.getElementById('current-class-label').textContent = 'Thương gia';
        basePrice = 4000000;
    }
    selectedClass = cls;
    selectedSeat = null;

    const rows = cls === 'eco' ? 6 : 3;
    generateOccupiedSeats(rows, ['A', 'B', 'C', 'D', 'E', 'F']);

    renderSeatMap();
    updateTotal();
}

function renderSeatMap() {
    const grid = document.getElementById('seat-map-grid');
    grid.innerHTML = '';
    const rows = selectedClass === 'eco' ? 6 : 3;
    const cols = ['A', 'B', 'C', 'D', 'E', 'F'];

    if (occupiedSeats.length === 0) {
        generateOccupiedSeats(rows, cols);
    }

    for (let i = 1; i <= rows; i++) {
        for (let j = 0; j < 6; j++) {
            const seatId = `${i}${cols[j]}`;
            const isOccupied = occupiedSeats.includes(seatId);
            const seatDiv = document.createElement('div');

            if (isOccupied) {
                seatDiv.className = 'seat occupied';
                seatDiv.textContent = seatId;
            } else {
                seatDiv.className = `seat available ${selectedSeat === seatId ? 'selected' : ''}`;
                seatDiv.textContent = seatId;
                seatDiv.onclick = () => handleSeatSelect(seatId);
            }
            grid.appendChild(seatDiv);
        }
    }
}

function handleSeatSelect(seatId) {
    hideAlert();
    selectedSeat = seatId;
    renderSeatMap();
}

function nextStep(target) {
    hideAlert();

    if (currentStep === 1 && target === 2) {
        if (!selectedSeat) {
            return showAlert('Luồng 8.5: Vui lòng chọn một chỗ ngồi trên sơ đồ trước khi tiếp tục.', 'error');
        }

        if ((selectedClass === 'eco' && selectedSeat === '3A') || (selectedClass === 'bus' && selectedSeat === '1A')) {
            occupiedSeats.push(selectedSeat);
            selectedSeat = null;
            renderSeatMap();
            return showAlert('Luồng 8.1: Rất tiếc, ghế bạn chọn vừa được khách hàng khác thanh toán. Vui lòng chọn ghế khác.', 'error');
        }
    }

    if (currentStep === 3 && target === 4) {
        const title = document.getElementById('p-title').value;
        const name = document.getElementById('p-name').value.toUpperCase();
        document.getElementById('sum-name').textContent = `${title} ${name}`;

        document.getElementById('sum-class').textContent = selectedClass === 'eco' ? 'Phổ thông' : 'Thương gia';
        document.getElementById('sum-seat').textContent = selectedSeat;

        const srvList = document.getElementById('sum-services');
        srvList.innerHTML = '';
        const baggageVal = document.getElementById('srv-baggage');
        const mealVal = document.getElementById('srv-meal');

        if (baggageVal.value !== "0") srvList.innerHTML += `<li>${baggageVal.options[baggageVal.selectedIndex].text}</li>`;
        if (mealVal.value !== "0") srvList.innerHTML += `<li>${mealVal.options[mealVal.selectedIndex].text}</li>`;
        if (baggageVal.value === "0" && mealVal.value === "0") {
            srvList.innerHTML = `<li>Không có dịch vụ bổ sung</li>`;
        }
    }

    showStep(target);
}

function validatePassengerInfo() {
    hideAlert();
    const name = document.getElementById('p-name').value.trim();
    const dob = document.getElementById('p-dob').value;
    const phone = document.getElementById('p-phone').value.trim();
    const email = document.getElementById('p-email').value.trim();

    if (!name || !dob || !phone || !email || !email.includes('@')) {
        return showAlert('Luồng 8.2: Vui lòng nhập đầy đủ và chính xác thông tin hành khách bắt buộc.', 'error');
    }

    showStep(3);
}

function updateTotal() {
    const mealVal = document.getElementById('srv-meal').value;
    if (mealVal === "120000") {
        showAlert('Luồng 8.3: Rất tiếc, suất ăn Mì ý sốt bò băm hiện đã hết. Hệ thống đã đặt lại mặc định.', 'error');
        document.getElementById('srv-meal').value = "0";
    }

    const baggagePrice = parseInt(document.getElementById('srv-baggage').value) || 0;
    const mealPrice = parseInt(document.getElementById('srv-meal').value) || 0;

    servicesPrice = baggagePrice + mealPrice;

    document.getElementById('price-base').textContent = basePrice.toLocaleString() + ' VND';
    document.getElementById('price-services').textContent = servicesPrice.toLocaleString() + ' VND';

    const total = basePrice + servicesPrice - discount;
    document.getElementById('price-total').textContent = Math.max(0, total).toLocaleString() + ' VND';
}

function applyPromo() {
    hideAlert();
    const code = document.getElementById('promo-code').value.trim().toUpperCase();
    const msgEl = document.getElementById('promo-msg');
    msgEl.classList.remove('hidden');

    if (!code) {
        msgEl.className = 'text-danger';
        msgEl.textContent = 'Vui lòng nhập mã khuyến mãi.';
        return;
    }

    if (code === 'FLIGHT2026') {
        discount = 200000;
        promoApplied = true;
        msgEl.className = 'text-success';
        msgEl.textContent = 'Luồng chính: Áp dụng mã thành công! Giảm 200,000 VND.';
        document.getElementById('price-discount').textContent = discount.toLocaleString() + ' VND';
        updateTotal();
    } else {
        discount = 0;
        promoApplied = false;
        msgEl.className = 'text-danger';
        msgEl.textContent = 'Luồng 8.4: Mã khuyến mãi không hợp lệ, đã hết hạn hoặc không áp dụng cho chuyến bay này.';
        document.getElementById('price-discount').textContent = '0 VND';
        updateTotal();
    }
}

function confirmBooking() {
    showAlert('Hệ thống đang xử lý tạo đơn đặt chỗ...', 'success');

    setTimeout(() => {
        window.location.href = 'uc09_thanhToan.html';
    }, 1200);
}

function cancelProcess() {
    if (confirm('Bạn có chắc chắn muốn hủy toàn bộ quá trình đặt vé? Hệ thống sẽ không lưu lại thông tin nào.')) {
        window.location.href = '../../trangChu.html';
    }
}
