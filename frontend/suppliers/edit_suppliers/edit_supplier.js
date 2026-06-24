async function loadSupplier() {
    try {
        const { supplier } = await apiGet('get_supplier', { id: getCurrentPageParam('id') });
        document.getElementById('supplier_id').value = supplier.supplier_id;
        document.getElementById('supplier_code').value = supplier.supplier_code;
        document.getElementById('name').value = supplier.name;
        document.getElementById('email').value = supplier.email;
        document.getElementById('phone').value = supplier.phone;
        document.getElementById('address').value = supplier.address;
        document.getElementById('logo_path').value = supplier.logo_path;
    } catch (error) {
        alert(error.message);
        loadPage('suppliers/suppliers.html');
    }
}

async function updateSupplier() {
    try {
        await apiPost('save_supplier', {
            supplier_id: document.getElementById('supplier_id').value,
            supplier_code: document.getElementById('supplier_code').value,
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            logo_path: document.getElementById('logo_path').value
        });
        loadPage('suppliers/suppliers.html');
    } catch (error) {
        alert(error.message);
    }
}

async function deleteSupplier() {
    if (!confirm('Delete this supplier? Products linked to it must be moved first.')) return;
    try {
        await apiPost('delete_supplier', { supplier_id: document.getElementById('supplier_id').value });
        loadPage('suppliers/suppliers.html');
    } catch (error) {
        alert(error.message);
    }
}

loadSupplier();
