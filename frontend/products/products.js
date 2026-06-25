async function loadProducts() {
    const table = document.getElementById('productTable');
    const search = document.getElementById('searchInput')?.value || '';
    const status = document.getElementById('statusFilter')?.value || '';
    table.innerHTML = '<tr><td colspan="8">Loading products...</td></tr>';

    try {
        const { products } = await apiGet('list_products', { search, status });
        if (!products.length) {
            table.innerHTML = '<tr><td colspan="8">No products found.</td></tr>';
            return;
        }

        table.innerHTML = products.map(product => `
            <tr onclick="openEditPage(${product.product_id})" class="clickable-row">
                <td>
                    <img 
                        src="../backend/${escapeHtml(product.image_path)}"
                        class="stock-thumbnail"
                        onerror="this.onerror=null; this.src='../backend/assets/products/product-placeholder.jpg';"
                    />
                </td>
                <td>${escapeHtml(product.product_code)}</td>
                <td>${escapeHtml(product.name)}</td>
                <td>RM ${money(product.price)}</td>
                <td>${product.quantity}</td>
                <td>${stockBadge(Number(product.quantity))}</td>
                <td><span class="status-badge ${product.status === 'active' ? 'active' : 'inactive'}">${escapeHtml(product.status)}</span></td>
            </tr>
        `).join('');
    } catch (error) {
        table.innerHTML = `<tr><td colspan="8">${escapeHtml(error.message)}</td></tr>`;
    }
}

function stockBadge(quantity) {
    if (quantity === 0) return '<span class="stock-out">Out of Stock</span>';
    if (quantity < 10) return '<span class="stock-low">Low Stock</span>';
    return '<span class="stock-ok">Stock Available</span>';
}

function applyFilters() {
    loadProducts();
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('statusFilter').value = '';
    loadProducts();
}

function openEditPage(id) {
    loadPage(`products/edit_product/edit_product.html?id=${id}`);
}

loadProducts();