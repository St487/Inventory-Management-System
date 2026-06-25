window.stockChartInstance = window.stockChartInstance || null;

window.loadDashboard = async function loadDashboard() {
    const cards = document.getElementById('summaryCards');
    const recentBox = document.getElementById('recentTransactions');

    cards.innerHTML = '<div class="metric-card"><span>Loading dashboard...</span></div>';
    recentBox.innerHTML = '<p>Loading recent transactions...</p>';

    try {
        const { summary, chart, recent } = await apiGet('dashboard');

        cards.innerHTML = `
            ${dashboardCard('Total Sales', `RM ${money(summary.total_sales)}`, 'fa-chart-line')}
            ${dashboardCard('Total Profit', `RM ${summary.total_profit}`, 'fa-coins')}
            ${dashboardCard('Products', summary.total_products, 'fa-box')}
            ${dashboardCard('Customers', summary.total_customers, 'fa-users')}
            ${dashboardCard('Orders', summary.total_orders, 'fa-shopping-cart')}
            ${dashboardCard('Total Stock', summary.total_stock, 'fa-warehouse')}
            ${dashboardCard('Low Stock Items', summary.low_stock, 'fa-triangle-exclamation')}
        `;

        recentBox.innerHTML = recent.length ? recent.map(r => `
            <div class="recent-row">
                <span>${escapeHtml(r.order_no)}</span>
                <strong>RM ${money(r.total)}</strong>
                <em class="${r.payment_status === 'Unpaid' ? 'warn' : 'ok'}">${escapeHtml(r.payment_status)}</em>
            </div>
        `).join('') : '<p>No transactions yet.</p>';

        const canvas = document.getElementById('stockChart');
        if (!window.Chart) {
            canvas.insertAdjacentHTML('afterend', '<p style="color:#b91c1c;margin-top:10px;">Chart.js did not load. Check internet connection.</p>');
            return;
        }

        if (window.stockChartInstance) {
            window.stockChartInstance.destroy();
        }

        window.stockChartInstance = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: chart.map(item => item.name),
                datasets: [{
                    label: 'Quantity',
                    data: chart.map(item => Number(item.quantity)),
                    backgroundColor: '#3b82f6'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: false } }
            }
        });
    } catch (error) {
        cards.innerHTML = `<div class="metric-card"><span style="color:#b91c1c;">${escapeHtml(error.message)}</span></div>`;
        recentBox.innerHTML = '<p>Unable to load recent transactions.</p>';
    }
};

function dashboardCard(label, value, icon) {
    return `
        <div class="metric-card">
            <i class="fa ${icon}"></i>
            <span>${label}</span>
            <strong>${value}</strong>
        </div>
    `;
}

loadDashboard();
