async function loadSupplierOptions() {
    const { suppliers } = await apiGet('list_suppliers');
    const select = document.getElementById('supplier_id');
    select.innerHTML = '<option value="">Select Supplier</option>' + suppliers
        .map(s => `<option value="${s.supplier_id}">${escapeHtml(s.name)}</option>`)
        .join('');
}

async function saveProduct() {
    const payload = {
        product_code: document.getElementById('product_code').value,
        name: document.getElementById('product_name').value,
        price: document.getElementById('price').value,
        quantity: document.getElementById('quantity').value,
        supplier_id: document.getElementById('supplier_id').value,
        image_path: document.getElementById('image_path').value || 'assets/product-placeholder.png',
        status: document.getElementById('status').value
    };

    try {
        await apiPost('save_product', payload);
        loadPage('products/products.html');
    } catch (error) {
        alert(error.message);
    }
}

loadSupplierOptions();
