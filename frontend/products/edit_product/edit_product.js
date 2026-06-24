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

async function loadProduct() {
    const id = getCurrentPageParam('id');
    try {
        const { product } = await apiGet('get_product', { id });
        document.getElementById('product_id').value = product.product_id;
        document.getElementById('product_code').value = product.product_code;
        document.getElementById('product_name').value = product.name;
        document.getElementById('price').value = product.price;
        document.getElementById('quantity').value = product.quantity;
        document.getElementById('thumbnail_preview').src = '../backend/' + product.image_path;
        document.getElementById('status').value = product.status;
        document.getElementById('stock_id').value = product.stock_id;
    } catch (error) {
        alert(error.message);
        loadPage('products/products.html');
    }
}

async function updateProduct() {
    try {
        const formData = new FormData();

        formData.append('product_id', document.getElementById('product_id').value);
        formData.append('product_code', document.getElementById('product_code').value);
        formData.append('name', document.getElementById('product_name').value);
        formData.append('price', document.getElementById('price').value);
        formData.append('quantity', document.getElementById('quantity').value);
        formData.append('stock_id', document.getElementById('stock_id').value);
        formData.append('status', document.getElementById('status').value);

        const fileInput = document.getElementById('image_path');
        if (fileInput.files.length > 0) {
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

async function deleteProduct() {
    if (!confirm('Delete this product?')) return;
    try {
        await apiPost('delete_product', { product_id: document.getElementById('product_id').value });
        loadPage('products/products.html');
    } catch (error) {
        alert(error.message);
    }
}

document.getElementById('image_path').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        document.getElementById('thumbnail_preview').src = URL.createObjectURL(file);
    }
});

window.initEditProductPage = async function () {
    await loadStockOptions();   // FIRST
    await loadProduct();        // SECOND
};

initEditProductPage();