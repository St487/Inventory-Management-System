async function loadStockOptions() {
    const { stocks } = await apiGet('list_stock_dropdown');
    const select = document.getElementById('stock_id');

    select.innerHTML = `
        <option value="">Select Stock</option>
    ` + stocks.map(s => `
        <option value="${s.stock_id}">
            ${escapeHtml(s.stock_code)} - ${escapeHtml(s.name)} (Qty: ${s.quantity})
        </option>
    `).join('');
}

async function saveProduct() {
    try {
        await validateProductQuantity();
        await validateForm();

        const fileInput = document.getElementById('image_path');

        const formData = new FormData();
        formData.append('product_code', document.getElementById('product_code').value);
        formData.append('name', document.getElementById('product_name').value);
        formData.append('price', document.getElementById('price').value);
        formData.append('quantity', document.getElementById('quantity').value);
        formData.append('stock_id', document.getElementById('stock_id').value);
        formData.append('status', document.getElementById('status').value);

        if (fileInput.files[0]) {
            formData.append('image_path', fileInput.files[0]);
        }

        await fetch(apiUrl('save_product'), {
            method: 'POST',
            body: formData
        });

        loadPage('products/products.html');

    } catch (error) {
        alert(error.message);
    }
}

async function validateForm() {
    const productCode = document.getElementById('product_code').value.trim();
    const name = document.getElementById('product_name').value.trim();
    const price = parseFloat(document.getElementById('price').value);
    const quantity = parseInt(document.getElementById('quantity').value);
    const stockId = document.getElementById('stock_id').value;

    if (!productCode) throw new Error('Product code is required.');
    if (!name) throw new Error('Product name is required.');
    if (isNaN(price) || price < 0) throw new Error('Invalid price.');
    if (isNaN(quantity) || quantity < 0) throw new Error('Invalid quantity.');
    if (!stockId) throw new Error('Please select a stock.');

    return true;
}

async function validateProductQuantity() {
    const stockId = document.getElementById('stock_id').value;
    const productQty = parseInt(document.getElementById('quantity').value || 0);

    if (!stockId) {
        throw new Error("Please select a stock first.");
    }

    const res = await apiGet('get_stock', { id: stockId });
    const stockQty = parseInt(res.stock.quantity);

    if (productQty > stockQty) {
        throw new Error(`Product quantity cannot exceed stock quantity (${stockQty}).`);
    }

    return true;
}

loadStockOptions();
