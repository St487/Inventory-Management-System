async function loadAnalysis() {
    const { insights, low_stock, best_sellers, total_sales } = await apiGet('analysis');
    document.getElementById('insightGrid').innerHTML = insights.map(text => `
        <div class="insight-card">
            <i class="fa fa-lightbulb"></i>
            <p>${escapeHtml(text)}</p>
        </div>
    `).join('') + `
        <div class="insight-card">
            <i class="fa fa-sack-dollar"></i>
            <p>Total paid sales analysed: RM ${money(total_sales)}</p>
        </div>
    `;

    document.getElementById('restockList').innerHTML = low_stock.length ? low_stock.map(p => `
        <div class="recent-row">
            <span>${escapeHtml(p.product_code)} - ${escapeHtml(p.name)}</span>
            <strong>${p.quantity} left</strong>
            <em class="warn">Restock</em>
        </div>
    `).join('') : '<p>No urgent restock suggestions.</p>';

    document.getElementById('bestSellerList').innerHTML = best_sellers.map(p => `
        <div class="recent-row">
            <span>${escapeHtml(p.name)}</span>
            <strong>${p.sold} sold</strong>
        </div>
    `).join('');
}

loadAnalysis();
