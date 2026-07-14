fetch('header.html')
    .then(response => response.text())
    .then(data => {
        const headerEl = document.getElementById('header');
        if (headerEl) headerEl.innerHTML = data;
    }).catch(e => console.log('Header load error:', e));

fetch('footer.html')
    .then(response => response.text())
    .then(data => {
        const footerEl = document.getElementById('footer');
        if (footerEl) footerEl.innerHTML = data;
    }).catch(e => console.log('Footer load error:', e));


let timerInterval;
let timeLeft = 10 * 60;
let isExpired = false;

document.addEventListener('DOMContentLoaded', () => {
    startTimer();
    
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            const ccForm = document.getElementById('cc-form');
            if (this.value === 'credit-card') {
                ccForm.style.display = 'block';
            } else {
                ccForm.style.display = 'none';
            }
        });
    });
});

function startTimer() {
    const timerDisplay = document.getElementById('countdown-timer');
    
    timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerDisplay.innerText = "00:00";
            handleExpiration();
            return;
        }
        
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        timerDisplay.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft < 60) {
            timerDisplay.style.color = '#d32f2f';
            timerDisplay.parentElement.style.borderColor = '#d32f2f';
            timerDisplay.parentElement.style.backgroundColor = '#fde8e8';
        }
    }, 1000);
}

function handleExpiration() {
    isExpired = true;
    showAlert('Hết thời gian thanh toán. Vé đã bị hủy.', 'error');
    
    const btnPay = document.getElementById('btn-pay');
    btnPay.disabled = true;
    btnPay.innerText = 'Đã hết hạn';
    
    const methods = document.querySelectorAll('input[name="payment-method"]');
    methods.forEach(m => m.disabled = true);
    
    const inputs = document.querySelectorAll('.credit-card-form input');
    inputs.forEach(i => i.disabled = true);
}

function confirmPayment() {
    if (isExpired) {
        showAlert('Hết thời gian thanh toán. Vé đã bị hủy.', 'error');
        return;
    }
    
    const selectedMethod = document.querySelector('input[name="payment-method"]:checked');
    
    if (!selectedMethod) {
        showAlert('Vui lòng chọn phương thức thanh toán.', 'error');
        return;
    }
    
    const btnPay = document.getElementById('btn-pay');
    const originalText = btnPay.innerHTML;
    btnPay.disabled = true;
    btnPay.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang xử lý...';
    
    setTimeout(() => {
        btnPay.disabled = false;
        btnPay.innerHTML = originalText;
        
        if (selectedMethod.value === 'fail-test') {
            showAlert('Thanh toán thất bại. Vui lòng kiểm tra lại số dư hoặc thẻ của bạn.', 'error');
            return;
        }
        
        clearInterval(timerInterval);
        document.getElementById('success-modal').classList.add('active');
        
    }, 1500);
}

function cancelPayment() {
    const confirmCancel = confirm('Bạn có chắc chắn muốn hủy giao dịch này không? Vé sẽ bị hủy nếu bạn không thanh toán kịp thời gian.');
    if (confirmCancel) {
        window.location.href = 'trangChu.html';
    }
}

function showAlert(message, type) {
    const alertBox = document.getElementById('payment-alert');
    alertBox.innerText = message;
    alertBox.className = 'alert-box';
    
    if (type === 'error') {
        alertBox.classList.add('alert-error');
    }
    
    alertBox.style.display = 'block';
    
    alertBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
