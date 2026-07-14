let statChart = null;

function toggleDatePicker() {
    const timeRange = document.getElementById('time-range').value;
    const dateGroup = document.getElementById('date-picker-group');
    const dateInput = document.getElementById('date-picker');
    const dateLabel = document.getElementById('date-label');

    if (timeRange === 'all') {
        dateGroup.style.display = 'none';
        dateInput.value = '';
    } else {
        dateGroup.style.display = 'flex';
        if (timeRange === 'month') {
            dateLabel.innerHTML = '<i class="fa-regular fa-calendar"></i> Chọn tháng';
            dateInput.type = 'month';
        } else if (timeRange === 'week') {
            dateLabel.innerHTML = '<i class="fa-regular fa-calendar"></i> Chọn tuần';
            dateInput.type = 'week';
        }
    }
}

function showAlert(type, message, icon) {
    const alertBox = document.getElementById('alert-message');
    const alertText = document.getElementById('alert-text');
    const alertIcon = document.getElementById('alert-icon');
    
    alertBox.className = `alert alert-${type}`;
    alertText.textContent = message;
    alertIcon.innerHTML = `<i class="fa-solid fa-${icon}"></i>`;
    alertBox.style.display = 'flex';
    
    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 5000);
}

function getMockData(criteria, timeRange, dateValue) {
    // Generate some labels based on time range
    let labels = [];
    if (timeRange === 'week') {
        labels = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];
    } else if (timeRange === 'month') {
        labels = Array.from({length: 4}, (_, i) => `Tuần ${i + 1}`);
    } else {
        labels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
    }

    // Generate specific mock data based on criteria
    let data = [];
    let labelName = '';
    let bgColor = '';
    let borderColor = '';
    
    // Quick random generator
    const generateRandom = (min, max) => labels.map(() => Math.floor(Math.random() * (max - min + 1)) + min);

    switch (criteria) {
        case 'revenue':
            labelName = 'Doanh thu (VNĐ)';
            data = generateRandom(50000000, 200000000);
            bgColor = 'rgba(13, 110, 253, 0.2)';
            borderColor = 'rgba(13, 110, 253, 1)';
            break;
        case 'tickets':
            labelName = 'Vé đã bán';
            data = generateRandom(100, 1000);
            bgColor = 'rgba(25, 135, 84, 0.2)';
            borderColor = 'rgba(25, 135, 84, 1)';
            break;
        case 'frequency':
            labelName = 'Chuyến bay';
            data = generateRandom(10, 50);
            bgColor = 'rgba(111, 66, 193, 0.2)';
            borderColor = 'rgba(111, 66, 193, 1)';
            break;
        case 'cancel_rate':
            labelName = 'Vé hủy';
            data = generateRandom(0, 20);
            bgColor = 'rgba(220, 53, 69, 0.2)';
            borderColor = 'rgba(220, 53, 69, 1)';
            break;
        case 'customers':
            labelName = 'Khách hàng mới';
            data = generateRandom(20, 150);
            bgColor = 'rgba(253, 126, 20, 0.2)';
            borderColor = 'rgba(253, 126, 20, 1)';
            break;
        case 'occupancy':
            labelName = 'Tỷ lệ lấp đầy (%)';
            data = generateRandom(60, 100);
            bgColor = 'rgba(13, 202, 240, 0.2)';
            borderColor = 'rgba(13, 202, 240, 1)';
            break;
    }

    return {
        labels: labels,
        datasets: [{
            label: labelName,
            data: data,
            backgroundColor: bgColor,
            borderColor: borderColor,
            borderWidth: 2,
            tension: 0.3,
            fill: true
        }]
    };
}

function renderOverviewCards(criteria, dataset) {
    const cardsContainer = document.getElementById('overview-cards');
    
    const totalData = dataset.datasets[0].data.reduce((a, b) => a + b, 0);
    const avgData = (totalData / dataset.datasets[0].data.length).toFixed(1);
    
    let formattedTotal = totalData;
    let formattedAvg = avgData;
    let unit = '';
    
    if (criteria === 'revenue') {
        formattedTotal = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalData);
        formattedAvg = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(avgData);
    } else if (criteria === 'occupancy') {
        formattedTotal = avgData + '% (Trung bình)';
        formattedAvg = Math.max(...dataset.datasets[0].data) + '% (Cao nhất)';
    }

    // Determine icon and colors based on criteria
    let iconClass, colorClass, title;
    switch(criteria) {
        case 'revenue': iconClass = 'fa-sack-dollar'; colorClass = 'icon-blue'; title = 'Tổng doanh thu'; break;
        case 'tickets': iconClass = 'fa-ticket'; colorClass = 'icon-green'; title = 'Tổng vé xuất'; break;
        case 'frequency': iconClass = 'fa-plane-up'; colorClass = 'icon-purple'; title = 'Tổng chuyến bay'; break;
        case 'cancel_rate': iconClass = 'fa-ban'; colorClass = 'icon-red'; title = 'Tổng vé hủy'; break;
        case 'customers': iconClass = 'fa-users'; colorClass = 'icon-orange'; title = 'Khách mới'; break;
        case 'occupancy': iconClass = 'fa-chair'; colorClass = 'icon-blue'; title = 'Lấp đầy trung bình'; break;
    }

    cardsContainer.innerHTML = `
        <div class="stat-card">
            <div class="stat-icon ${colorClass}">
                <i class="fa-solid ${iconClass}"></i>
            </div>
            <div class="stat-info">
                <div class="stat-title">${title}</div>
                <div class="stat-value">${formattedTotal}</div>
                <div class="stat-trend trend-up"><i class="fa-solid fa-arrow-trend-up"></i> +5% so với kỳ trước</div>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon icon-green">
                <i class="fa-solid fa-chart-line"></i>
            </div>
            <div class="stat-info">
                <div class="stat-title">Trung bình / kỳ</div>
                <div class="stat-value">${formattedAvg}</div>
                <div class="stat-trend trend-neutral"><i class="fa-solid fa-minus"></i> Ổn định</div>
            </div>
        </div>
    `;
}

function updateChart(chartData) {
    const ctx = document.getElementById('statChart').getContext('2d');
    
    if (statChart) {
        statChart.destroy();
    }
    
    statChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            family: "'Inter', sans-serif"
                        }
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0,0,0,0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function performStatistics() {
    const timeRange = document.getElementById('time-range').value;
    const dateInput = document.getElementById('date-picker').value;
    const criteria = document.getElementById('criteria').value;

    // Validate Input (Alternative Flow 19.1)
    if (timeRange !== 'all' && !dateInput) {
        showAlert('danger', 'Vui lòng chọn thời gian để thống kê!', 'circle-exclamation');
        return;
    }

    // Check future dates
    if (timeRange !== 'all' && dateInput) {
        const selectedDate = new Date(dateInput);
        const currentDate = new Date();
        if (selectedDate > currentDate) {
            showAlert('danger', 'Thời gian chọn nằm trong tương lai, chưa có dữ liệu!', 'circle-exclamation');
            return;
        }
    }

    // Simulate Empty Data for '2020' or older (Alternative Flow 19.2)
    if (dateInput && dateInput.includes('2020')) {
        showAlert('info', 'Không tìm thấy dữ liệu hoạt động trong khoảng thời gian này.', 'circle-info');
        document.getElementById('results-area').style.display = 'none';
        document.getElementById('export-btn').disabled = true;
        return;
    }

    // Proceed to generate data
    document.getElementById('results-area').style.display = 'block';
    document.getElementById('export-btn').disabled = false;
    
    // Update Chart Title
    const criteriaText = document.getElementById('criteria').options[document.getElementById('criteria').selectedIndex].text;
    document.getElementById('chart-title').textContent = `Biểu đồ thống kê: ${criteriaText}`;

    // Generate mock data
    const chartData = getMockData(criteria, timeRange, dateInput);
    
    // Update UI
    renderOverviewCards(criteria, chartData);
    updateChart(chartData);
}

function exportPDF() {
    showAlert('info', 'Đang chuẩn bị dữ liệu và xuất báo cáo PDF...', 'spinner fa-spin');
    setTimeout(() => {
        showAlert('info', 'Đã xuất file báo cáo PDF thành công!', 'check-circle');
    }, 2000);
}

// Initial state
document.addEventListener('DOMContentLoaded', () => {
    performStatistics();
});
