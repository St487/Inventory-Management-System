window.currentStockProduct = null;

function getStockEditId() {
    const id = getCurrentPageParam('id');
    return id || document.getElementById('product_id')?.value || '';
}

window.loadStock = async function loadStock() {
    const id = getStockEditId();
    if (!id) {
        alert('No product selected for stock update.');
        loadPage('stock/stock.html');
        return;
    }

    try {
        const { product } = await apiGet('get_product', { id });
        window.currentStockProduct = product;
        document.getElementById('product_id').value = product.product_id;
        document.getElementById('product_code').value = product.product_code;
        document.getElementById('name').value = product.name;
        document.getElementById('quantity').value = product.quantity;
        setStockPreview();
        document.getElementById('quantity').addEventListener('input', setStockPreview);
    } catch (error) {
        alert(error.message);
        loadPage('stock/stock.html');
    }
};

window.setStockPreview = function setStockPreview() {
    const quantity = Number(document.getElementById('quantity').value || 0);
    document.getElementById('status_preview').value =
        quantity === 0 ? 'Out of Stock' : quantity < 10 ? 'Low Stock' : 'Stock Available';
};

window.updateStock = async function updateStock() {
    const productId = document.getElementById('product_id').value;
    let product = window.currentStockProduct;

    try {
        if (!product || String(product.product_id) !== String(productId)) {
            const response = await apiGet('get_product', { id: productId });
            product = response.product;
        }

        await apiPost('save_product', {
            product_id: product.product_id,
            product_code: product.product_code,
            name: product.name,
            price: product.price,
            quantity: document.getElementById('quantity').value,
            supplier_id: product.supplier_id,
            image_path: product.image_path,
            status: product.status
        });
        loadPage('stock/stock.html');
    } catch (error) {
        alert(error.message);
    }
};

loadStock();
