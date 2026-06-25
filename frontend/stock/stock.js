window.loadStocks = async function loadStocks() {
    const table = document.getElementById('stockTable');
    const search = document.getElementById('searchInput')?.value || '';

    table.innerHTML = '<tr><td colspan="7">Loading stock...</td></tr>';

    try {
        const { stocks } = await apiGet('list_stock', { search });

        const supplier = document.getElementById('supplierFilter')?.value || '';
        const filtered = supplier
            ? stocks.filter(s => s.supplier_name === supplier)
            : stocks;

        await loadSupplierFilter(supplier);

        if (!filtered.length) {
            table.innerHTML = '<tr><td colspan="7">No stock records found.</td></tr>';
            return;
        }

        table.innerHTML = filtered.map(stock => `
            <tr onclick="openStockEditPage(${stock.stock_id})" class="clickable-row">
                <td>
                    <img 
                        src="../backend/${escapeHtml(stock.image_path)}"
                        class="stock-thumbnail"
                        onerror="this.onerror=null; this.src='../backend/assets/products/product-placeholder.jpg';"
                    />
                </td>
                <td>${escapeHtml(stock.stock_code)}</td>
                <td>${escapeHtml(stock.name)}</td>
                <td>RM ${money(stock.price)}</td>
                <td>${stock.quantity}</td>
                <td>${escapeHtml(stock.supplier_name || '-')}</td>
                <td>${stockBadge(Number(stock.quantity))}</td>
            </tr>
        `).join('');

    } catch (error) {
        table.innerHTML = `<tr><td colspan="7">${escapeHtml(error.message)}</td></tr>`;
    }
};

async function loadSupplierFilter(selected = '') {
    const select = document.getElementById('supplierFilter');
    if (!select || select.dataset.loaded === '1') return;
    const { suppliers } = await apiGet('list_suppliers');
    select.innerHTML = '<option value="">All Suppliers</option>' + suppliers
        .map(s => `<option value="${escapeHtml(s.name)}" ${s.name === selected ? 'selected' : ''}>${escapeHtml(s.name)}</option>`)
        .join('');
    select.dataset.loaded = '1';
}

function stockBadge(quantity) {
    if (quantity === 0) return '<span class="stock-out">Out Of Stock</span>';
    if (quantity < 10) return '<span class="stock-low">Low Stock</span>';
    return '<span class="stock-ok">Stock Available</span>';
}

window.applyFilters = function applyFilters() {
    loadStocks();
};

window.clearFilters = function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('supplierFilter').value = '';
    loadStocks();
};

window.openStockEditPage = function openStockEditPage(id) {
    loadPage(`stock/edit_stock/edit_stock.html?id=${encodeURIComponent(id)}&ts=${Date.now()}`);
};

loadStocks();
