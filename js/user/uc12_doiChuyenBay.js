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
function showStep(stepId) {
    document.querySelectorAll('.step-section').forEach(el => el.style.display = 'none');
    document.getElementById(stepId).style.display = 'block';
    hideAlert();
}

function showAlert(message, type = 'error') {
    const alertEl = document.getElementById('alert-message');
    alertEl.textContent = message;
    alertEl.className = `alert alert-${type}`;
    alertEl.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hideAlert() {
    document.getElementById('alert-message').style.display = 'none';
}

function checkExchangeCondition() {
    showStep('step-2');
}

function searchNewFlights() {
    const date = document.getElementById('new-date').value;
    if (!date) {
        showAlert('Vui lòng chọn ngày đi mới!');
        return;
    }
    showStep('step-3');
}

let selectedFlightBtn = null;
let currentDiff = 0;

function selectFlightAndSeat(btn, diffAmount) {
    if (selectedFlightBtn) {
        selectedFlightBtn.closest('.flight-option').classList.remove('selected');
        selectedFlightBtn.textContent = 'Chọn chuyến này';
    }
    btn.closest('.flight-option').classList.add('selected');
    btn.textContent = 'Đã chọn';
    selectedFlightBtn = btn;
    currentDiff = diffAmount;
    
    document.getElementById('seat-selection').style.display = 'block';
    
    document.querySelectorAll('.seat.selected').forEach(s => s.classList.remove('selected'));
    document.getElementById('selected-seat').textContent = 'Chưa chọn';
    document.getElementById('btn-confirm-seat').disabled = true;
}

function selectSeat(seatEl) {
    if (seatEl.classList.contains('occupied')) {
        showAlert('Vị trí ghế này vừa bị một tài khoản khác đặt. Vui lòng chọn ghế khác!');
        return;
    }
    
    document.querySelectorAll('.seat.selected').forEach(s => s.classList.remove('selected'));
    seatEl.classList.add('selected');
    document.getElementById('selected-seat').textContent = seatEl.textContent;
    document.getElementById('btn-confirm-seat').disabled = false;
    hideAlert();
}

let timerInterval;
function goToSummary() {
    showStep('step-4');
    
    const diffLabel = document.getElementById('diff-label');
    const diffAmountEl = document.getElementById('diff-amount');
    const btnPayment = document.getElementById('btn-payment');
    const refundForm = document.getElementById('refund-form');
    
    if (currentDiff > 0) {
        diffLabel.textContent = "Tổng tiền chênh lệch cần thanh toán:";
        diffAmountEl.textContent = "+ " + currentDiff.toLocaleString() + " VND";
        diffAmountEl.className = "text-danger";
        btnPayment.textContent = "Thanh toán chênh lệch";
        refundForm.style.display = "none";
        document.getElementById('new-price-text').textContent = "6,000,000 VND"; // mock
    } else if (currentDiff < 0) {
        diffLabel.textContent = "Số tiền được hoàn lại:";
        diffAmountEl.textContent = Math.abs(currentDiff).toLocaleString() + " VND";
        diffAmountEl.className = "text-success";
        btnPayment.textContent = "Xác nhận đổi chuyến";
        refundForm.style.display = "block"; // Hiển thị form hoàn tiền
        document.getElementById('new-price-text').textContent = "4,000,000 VND"; // mock
    } else {
        diffLabel.textContent = "Tổng tiền chênh lệch:";
        diffAmountEl.textContent = "0 VND";
        diffAmountEl.className = "text-success";
        btnPayment.textContent = "Xác nhận đổi chuyến";
        refundForm.style.display = "none";
        document.getElementById('new-price-text').textContent = "4,500,000 VND"; // mock (5tr - phí 500k = 4tr5 vé mới để chênh lệch 0)
    }

    startCountdown(10, 0);
}

function startCountdown(minutes, seconds) {
    clearInterval(timerInterval);
    let time = minutes * 60 + seconds;
    const display = document.getElementById('countdown-timer');
    
    timerInterval = setInterval(() => {
        let m = Math.floor(time / 60);
        let s = time % 60;
        m = m < 10 ? '0' + m : m;
        s = s < 10 ? '0' + s : s;
        display.textContent = m + ':' + s;
        
        if (--time < 0) {
            clearInterval(timerInterval);
            showAlert('Phiên giao dịch đã hết hạn do quá 10 phút. Ghế tạm giữ đã bị hủy.', 'error');
            showStep('step-1');
        }
    }, 1000);
}

function processPayment() {
    clearInterval(timerInterval);
    showStep('step-5');
}

function cancelProcess() {
    if(confirm('Bạn có chắc chắn muốn hủy quá trình đổi chuyến? Việc này sẽ giải phóng ghế đang tạm giữ.')) {
        clearInterval(timerInterval);
        showStep('step-1');
        hideAlert();
        
        if (selectedFlightBtn) {
            selectedFlightBtn.closest('.flight-option').classList.remove('selected');
            selectedFlightBtn.textContent = 'Chọn chuyến này';
            selectedFlightBtn = null;
        }
        document.getElementById('seat-selection').style.display = 'none';
        document.querySelectorAll('.seat.selected').forEach(s => s.classList.remove('selected'));
    }
}
