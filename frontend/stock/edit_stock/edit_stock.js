window.currentStock = null;

function getStockEditId() {
    return getCurrentPageParam('id');
}

window.loadStock = async function () {
    const id = getStockEditId();

    if (!id) {
        alert('No stock selected');
        loadPage('stock/stock.html');
        return;
    }

    try {
        const { stock } = await apiGet('get_stock', { id });

        window.currentStock = stock;

        document.getElementById('stock_id').value = stock.stock_id;
        document.getElementById('stock_code').value = stock.stock_code;
        document.getElementById('name').value = stock.name;
        document.getElementById('price').value = stock.price;
        document.getElementById('quantity').value = stock.quantity;
        document.getElementById('supplier_id').value = stock.supplier_id;
        document.getElementById('thumbnail_preview').src = '../backend/' + stock.image_path;

        setStockPreview();

    } catch (err) {
        alert(err.message);
        loadPage('stock/stock.html');
    }
};

window.setStockPreview = function () {
    const qty = Number(document.getElementById('quantity').value || 0);

    document.getElementById('status_preview').value =
        qty === 0 ? 'Out of Stock'
        : qty < 10 ? 'Low Stock'
        : 'Stock Available';
};

window.updateStock = async function () {
    const stockId = document.getElementById('stock_id').value;

    const formData = new FormData();

    formData.append('stock_id', stockId);
    formData.append('stock_code', document.getElementById('stock_code').value.trim());
    formData.append('name', document.getElementById('name').value.trim());
    formData.append('price', document.getElementById('price').value);
    formData.append('quantity', document.getElementById('quantity').value);
    formData.append('supplier_id', document.getElementById('supplier_id').value);

    const file = document.getElementById('image_path').files[0];
    if (file) {
        formData.append('image_path', file);
    }

    try {
        await apiPost('save_stock', formData);
        loadPage('stock/stock.html');
    } catch (err) {
        alert(err.message);
    }
};
window.loadSuppliersForStock = async function () {
    const select = document.getElementById('supplier_id');

    if (!select) {
        console.warn('supplier dropdown not ready yet');
        return;
    }

    try {
        const { suppliers } = await apiGet('list_suppliers_dropdown');

        select.innerHTML = `
            <option value="">Select Supplier</option>
            ${suppliers.map(s => `
                <option value="${s.supplier_id}">
                    ${s.name}
                </option>
            `).join('')}
        `;

    } catch (err) {
        console.error('Supplier load failed:', err);
    }
};

document.getElementById('image_path').addEventListener('change', function (e) {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (event) {
        document.getElementById('thumbnail_preview').src = event.target.result;
    };

    reader.readAsDataURL(file);
});

window.initEditStockPage = async function () {
    await loadSuppliersForStock();
    await loadStock();
};

initEditStockPage();