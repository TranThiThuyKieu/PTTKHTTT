const form = document.getElementById('profileForm');
const messageBox = document.getElementById('messageBox');
const resetBtn = document.getElementById('resetBtn');

const summary = {
    name: document.getElementById('summaryName'),
    email: document.getElementById('summaryEmail'),
    phone: document.getElementById('summaryPhone'),
    address: document.getElementById('summaryAddress')
};

function fillSummary(data) {
    summary.name.textContent = data.fullName || '--';
    summary.email.textContent = data.email || '--';
    summary.phone.textContent = data.phone || '--';
    summary.address.textContent = data.address || '--';
}

function loadProfile() {
    const saved = localStorage.getItem('userProfile');
    if (!saved) return;

    try {
        const profile = JSON.parse(saved);
        document.getElementById('fullName').value = profile.fullName || '';
        document.getElementById('dob').value = profile.dob || '';
        document.getElementById('email').value = profile.email || '';
        document.getElementById('phone').value = profile.phone || '';
        document.getElementById('gender').value = profile.gender || 'Nam';
        document.getElementById('nationality').value = profile.nationality || '';
        document.getElementById('address').value = profile.address || '';
        fillSummary(profile);
    } catch (error) {
        console.error('Invalid profile data', error);
    }
}

form.addEventListener('submit', function (event) {
    event.preventDefault();

    const profile = {
        fullName: document.getElementById('fullName').value.trim(),
        dob: document.getElementById('dob').value,
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        gender: document.getElementById('gender').value,
        nationality: document.getElementById('nationality').value.trim(),
        address: document.getElementById('address').value.trim(),
        password: document.getElementById('password').value
    };

    if (!profile.fullName || !profile.email) {
        messageBox.textContent = 'Vui lòng nhập đầy đủ họ tên và email.';
        messageBox.style.color = '#dc2626';
        return;
    }

    localStorage.setItem('userProfile', JSON.stringify(profile));
    fillSummary(profile);
    messageBox.textContent = 'Cập nhật thông tin thành công.';
    messageBox.style.color = '#15803d';
    document.getElementById('password').value = '';
});

resetBtn.addEventListener('click', function () {
    form.reset();
    document.getElementById('gender').value = 'Nam';
    messageBox.textContent = '';
    const saved = localStorage.getItem('userProfile');
    if (saved) {
        try {
            const profile = JSON.parse(saved);
            fillSummary(profile);
        } catch (error) {
            console.error('Invalid profile data', error);
        }
    }
});

document.addEventListener('DOMContentLoaded', loadProfile);


fetch("../user/header.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById('header').innerHTML = data;
        if (typeof initHeader === 'function') {
            initHeader();
        }
    });
fetch("../user/footer.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer').innerHTML = data;
    });