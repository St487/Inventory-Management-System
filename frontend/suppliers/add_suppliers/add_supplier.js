window.saveSupplier = async function () {
    const supplierCode = document.getElementById('supplier_code').value.trim();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const logoFile = document.getElementById('logo_path').files[0];

    if (!supplierCode || !name || !email || !phone || !address) {
        alert('Supplier Code, Name, Email, Phone, and Address are required.');
        return;
    }

    // Optional frontend email validation
    if (!email.includes('@')) {
        alert('Please enter a valid email address.');
        return;
    }

    const formData = new FormData();

    formData.append('supplier_code', supplierCode);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('address', address);

    if (logoFile) {
        formData.append('logo_path', logoFile);
    }

    try {
        // Same method as saveStock
        await apiPost('save_supplier', formData);

        alert('Supplier saved successfully.');
        loadPage('suppliers/suppliers.html');

    } catch (error) {
        alert(error.message);
    }
};