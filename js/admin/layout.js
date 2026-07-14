document.addEventListener("DOMContentLoaded", () => {
    const basePath = window.location.pathname.includes('/admin/') ? './' : 'html/admin/';

    // Load Sidebar
    fetch(basePath + 'sidebar.html')
        .then(res => {
            if (!res.ok) throw new Error("Sidebar not found");
            return res.text();
        })
        .then(data => {
            const sidebarContainer = document.getElementById('sidebar-container');
            if (sidebarContainer) {
                sidebarContainer.innerHTML = data;

                // Highlight active link
                const currentPath = window.location.pathname.split('/').pop();
                const navItems = sidebarContainer.querySelectorAll('.nav-item');
                navItems.forEach(item => {
                    const href = item.getAttribute('href');
                    if (href && currentPath === href) {
                        item.classList.add('active');
                    }
                });
            }
        })
        .catch(err => console.error("Error loading sidebar:", err));

    // Load Header
    fetch(basePath + 'header.html')
        .then(res => {
            if (!res.ok) throw new Error("Header not found");
            return res.text();
        })
        .then(data => {
            const headerContainer = document.getElementById('header-container');
            if (headerContainer) {
                headerContainer.innerHTML = data;

                // Setup Toggle Sidebar Button
                const toggleBtn = document.getElementById('toggle-sidebar');
                if (toggleBtn) {
                    toggleBtn.addEventListener('click', () => {
                        const sidebar = document.querySelector('.admin-sidebar');
                        if (sidebar) {
                            sidebar.classList.toggle('collapsed');
                        }
                    });
                }
            }
        })
        .catch(err => console.error("Error loading header:", err));
});
