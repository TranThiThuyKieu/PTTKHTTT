const feedbackData = [
    {
        id: 'FB001',
        customer: 'Nguyễn An',
        content: 'Chuyến bay bị trễ, cần hỗ trợ đổi vé.',
        type: 'Chuyến bay',
        priority: 'Cao',
        status: 'Chờ xử lý'
    },
    {
        id: 'FB002',
        customer: 'Trần Minh',
        content: 'Hệ thống thanh toán lỗi trong lần đặt cuối.',
        type: 'Hệ thống',
        priority: 'Trung bình',
        status: 'Đang phản hồi'
    },
    {
        id: 'FB003',
        customer: 'Lê Hòa',
        content: 'Rất hài lòng với dịch vụ hỗ trợ.',
        type: 'Dịch vụ',
        priority: 'Thấp',
        status: 'Đã đóng'
    }
];

const feedbackTableBody = document.getElementById('feedbackTableBody');
const feedbackSearch = document.getElementById('feedbackSearch');
const priorityFilter = document.getElementById('priorityFilter');
const resetFilterBtn = document.getElementById('resetFilterBtn');

function renderFeedback(list) {
    feedbackTableBody.innerHTML = '';

    if (!list.length) {
        feedbackTableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:#64748b;">Không có dữ liệu</td></tr>';
        return;
    }

    list.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.customer}</td>
            <td>${item.content}</td>
            <td>${item.type}</td>
            <td><span class="priority ${item.priority === 'Cao' ? 'high' : item.priority === 'Trung bình' ? 'medium' : 'low'}">${item.priority}</span></td>
            <td><span class="status-badge">${item.status}</span></td>
            <td><button class="action-btn">Xem</button></td>
        `;
        feedbackTableBody.appendChild(row);
    });
}

function updateStats(list) {
    document.getElementById('totalFeedback').textContent = list.length;
    document.getElementById('pendingFeedback').textContent = list.filter(item => item.status === 'Chờ xử lý').length;
    document.getElementById('replyingFeedback').textContent = list.filter(item => item.status === 'Đang phản hồi').length;
    document.getElementById('closedFeedback').textContent = list.filter(item => item.status === 'Đã đóng').length;
}

function filterFeedback() {
    const keyword = feedbackSearch.value.toLowerCase();
    const priority = priorityFilter.value;

    const filtered = feedbackData.filter(item => {
        const matchesKeyword = item.customer.toLowerCase().includes(keyword) || item.content.toLowerCase().includes(keyword);
        const matchesPriority = priority === 'all' || item.priority === priority;
        return matchesKeyword && matchesPriority;
    });

    renderFeedback(filtered);
    updateStats(filtered);
}

feedbackSearch.addEventListener('input', filterFeedback);
priorityFilter.addEventListener('change', filterFeedback);
resetFilterBtn.addEventListener('click', () => {
    feedbackSearch.value = '';
    priorityFilter.value = 'all';
    filterFeedback();
});

updateStats(feedbackData);
renderFeedback(feedbackData);
