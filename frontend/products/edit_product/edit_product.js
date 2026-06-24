async function loadSupplierOptions(selectedId) {
    const { suppliers } = await apiGet('list_suppliers');
    const select = document.getElementById('supplier_id');
    select.innerHTML = '<option value="">Select Supplier</option>' + suppliers
        .map(s => `<option value="${s.supplier_id}" ${String(s.supplier_id) === String(selectedId) ? 'selected' : ''}>${escapeHtml(s.name)}</option>`)
        .join('');
}

async function loadProduct() {
    const id = getCurrentPageParam('id');
    try {
        const { product } = await apiGet('get_product', { id });
        document.getElementById('product_id').value = product.product_id;
        document.getElementById('product_code').value = product.product_code;
        document.getElementById('product_name').value = product.name;
        document.getElementById('price').value = product.price;
        document.getElementById('quantity').value = product.quantity;
        document.getElementById('image_path').value = product.image_path;
        document.getElementById('status').value = product.status;
        await loadSupplierOptions(product.supplier_id);
    } catch (error) {
        alert(error.message);
        loadPage('products/products.html');
    }
}

async function updateProduct() {
    try {
        await apiPost('save_product', {
            product_id: document.getElementById('product_id').value,
            product_code: document.getElementById('product_code').value,
            name: document.getElementById('product_name').value,
            price: document.getElementById('price').value,
            quantity: document.getElementById('quantity').value,
            supplier_id: document.getElementById('supplier_id').value,
            image_path: document.getElementById('image_path').value,
            status: document.getElementById('status').value
        });
        loadPage('products/products.html');
    } catch (error) {
        alert(error.message);
    }
}

async function deleteProduct() {
    if (!confirm('Delete this product?')) return;
    try {
        await apiPost('delete_product', { product_id: document.getElementById('product_id').value });
        loadPage('products/products.html');
    } catch (error) {
        alert(error.message);
    }
}

loadProduct();
