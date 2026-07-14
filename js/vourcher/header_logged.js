function initHeader() {
    // logic set active menu, xử lý auth-section nếu cần
}

document.addEventListener('click', function (event) {
    const toggle = event.target.closest('.user-dropdown-toggle');
    const dropdown = document.querySelector('.user-dropdown');

    if (toggle) {
        event.stopPropagation();
        dropdown?.classList.toggle('open');
        return;
    }

    if (dropdown && !event.target.closest('.user-dropdown')) {
        dropdown.classList.remove('open');
    }
});