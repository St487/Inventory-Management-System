async function saveSupplier() {
    try {
        await apiPost('save_supplier', {
            supplier_code: document.getElementById('supplier_code').value,
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            logo_path: document.getElementById('logo_path').value || 'assets/supplier-placeholder.png'
        });
        loadPage('suppliers/suppliers.html');
    } catch (error) {
        alert(error.message);
    }
}
