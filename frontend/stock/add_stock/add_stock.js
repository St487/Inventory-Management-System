window.saveStock = async function () {

    const stockCode = document.getElementById('stock_code').value.trim();
    const name = document.getElementById('name').value.trim();
    const price = Number(document.getElementById('price').value);
    const quantity = Number(document.getElementById('quantity').value);
    const supplierId = document.getElementById('supplier_id').value;
    const imageFile = document.getElementById('image_path').files[0];

    if (!stockCode || !name || !supplierId) {
        alert('Stock Code, Name, and Supplier are required.');
        return;
    }

    if (isNaN(price) || price < 0) {
        alert('Invalid price.');
        return;
    }

    if (isNaN(quantity) || quantity < 0) {
        alert('Invalid quantity.');
        return;
    }

    const formData = new FormData();

    formData.append('stock_code', stockCode);
    formData.append('name', name);
    formData.append('price', price);
    formData.append('quantity', quantity);
    formData.append('supplier_id', supplierId);

    // AUTO STATUS (frontend helper)
    let status = 'Stock Available';
    if (quantity <= 0) status = 'Out of Stock';
    else if (quantity < 10) status = 'Low Stock';

    formData.append('status', status);

    if (imageFile) {
        formData.append('image_path', imageFile);
    }

    try {
        await apiPost('save_stock', formData);

        alert('Stock saved successfully.');
        loadPage('stock/stock.html');

    } catch (error) {
        alert(error.message);
    }
};

window.loadSuppliersForStock = async function () {
    try {
        const { suppliers } = await apiGet('list_suppliers');

        const supplierSelect = document.getElementById('supplier_id');

        supplierSelect.innerHTML = `
            <option value="">Select Supplier</option>
            ${suppliers.map(s => `
                <option value="${s.supplier_id}">
                    ${escapeHtml(s.name)}
                </option>
            `).join('')}
        `;
    } catch (error) {
        alert(error.message);
    }
};

loadSuppliersForStock();
