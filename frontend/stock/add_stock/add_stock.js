window.stockProducts = [];

window.loadStockProducts = async function loadStockProducts() {
    const { products } = await apiGet('list_products');
    window.stockProducts = products;
    const select = document.getElementById('product_id');
    select.innerHTML = products.map(p => `<option value="${p.product_id}">${escapeHtml(p.product_code)} - ${escapeHtml(p.name)}</option>`).join('');
    previewCurrentStock();
};

window.previewCurrentStock = function previewCurrentStock() {
    const product = window.stockProducts.find(p => String(p.product_id) === document.getElementById('product_id').value);
    document.getElementById('current_quantity').value = product ? product.quantity : 0;
};

window.saveStock = async function saveStock() {
    const product = window.stockProducts.find(p => String(p.product_id) === document.getElementById('product_id').value);
    if (!product) return;
    const addQuantity = Number(document.getElementById('add_quantity').value || 0);

    try {
        await apiPost('save_product', {
            product_id: product.product_id,
            product_code: product.product_code,
            name: product.name,
            price: product.price,
            quantity: Number(product.quantity) + addQuantity,
            supplier_id: product.supplier_id,
            image_path: product.image_path,
            status: product.status
        });
        loadPage('stock/stock.html');
    } catch (error) {
        alert(error.message);
    }
};

loadStockProducts();
