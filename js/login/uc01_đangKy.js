function moveNext(current, nextId) {
    if (current.value.length >= 1) {
        document.getElementById(nextId).focus();
    }
}
function handleRegister(e) {
    e.preventDefault();
    document.getElementById('step-register').style.display = 'none';
    document.getElementById('step-otp').style.display = 'block';
    document.getElementById('error-otp').style.display = 'none';
    document.getElementById('success-otp').style.display = 'none';
}
function handleVerifyOTP(e) {
    e.preventDefault();
    alert('Đăng ký tài khoản thành công! Hệ thống tự động chuyển hướng về trang Đăng nhập.');
    window.location.reload();
}
function handleResendOTP() {
    document.getElementById('success-otp').style.display = 'block';
    document.getElementById('error-otp').style.display = 'none';
}
function handleCancel() {
    if(confirm("Bạn có chắc chắn muốn hủy bỏ quá trình đăng ký không? Mọi thông tin đã nhập sẽ bị xóa.")) {
        window.location.reload();
    }
}