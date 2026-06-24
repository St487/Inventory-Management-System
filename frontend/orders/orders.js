window.orderProducts = [];

window.initOrders = async function initOrders() {
    const customerSelect = document.getElementById('customer_id');
    const productSelect = document.getElementById('product_id');
    const table = document.getElementById('orderTable');

    customerSelect.innerHTML = '<option value="">Loading customers...</option>';
    productSelect.innerHTML = '<option value="">Loading products...</option>';
    if (table) table.innerHTML = '<tr><td colspan="7">Loading orders...</td></tr>';

    try {
        const [{ customers }, { products }] = await Promise.all([
            apiGet('list_customers'),
            apiGet('list_products')
        ]);

        window.orderProducts = products.filter(p => p.status === 'active' && Number(p.quantity) > 0);

        customerSelect.innerHTML = customers.length
            ? '<option value="">Select Customer</option>' + customers.map(c => `<option value="${c.customer_id}">${escapeHtml(c.name)}</option>`).join('')
            : '<option value="">No customers available</option>';

        productSelect.innerHTML = window.orderProducts.length
            ? '<option value="">Select Product</option>' + window.orderProducts.map(p => `<option value="${p.product_id}">${escapeHtml(p.product_code)} - ${escapeHtml(p.name)} (${p.quantity})</option>`).join('')
            : '<option value="">No products with stock</option>';

        previewOrder();
        loadOrders();
        showFlash();
    } catch (error) {
        customerSelect.innerHTML = '<option value="">Failed to load customers</option>';
        productSelect.innerHTML = '<option value="">Failed to load products</option>';
        if (table) table.innerHTML = `<tr><td colspan="7">${escapeHtml(error.message)}</td></tr>`;
    }
};

window.previewOrder = function previewOrder() {
    const productId = document.getElementById('product_id').value;
    const product = window.orderProducts.find(p => String(p.product_id) === String(productId));
    const qty = Number(document.getElementById('quantity').value || 1);
    const box = document.getElementById('calculationBox');

    if (!product) {
        box.innerHTML = 'Select a product to calculate subtotal, discount, tax and total.';
        return;
    }

    const subtotal = Number(product.price) * qty;
    const discount = subtotal > 500 ? subtotal * 0.10 : 0;
    const tax = (subtotal - discount) * 0.06;
    const total = subtotal - discount + tax;
    const stockText = Number(product.quantity) === 0 ? 'Out of Stock' : Number(product.quantity) < 10 ? 'Low Stock' : 'Stock Available';

    box.innerHTML = `
        <strong>Calculation:</strong>
        Subtotal RM ${money(subtotal)} - Discount RM ${money(discount)} + Tax RM ${money(tax)}
        = <b>RM ${money(total)}</b>
        <span>${stockText}</span>
    `;
};

window.createOrder = async function createOrder() {
    const customerId = document.getElementById('customer_id').value;
    const productId = document.getElementById('product_id').value;

    if (!customerId || !productId) {
        alert('Please select both customer and product.');
        return;
    }

    try {
        await apiPost('create_order', {
            customer_id: customerId,
            product_id: productId,
            quantity: document.getElementById('quantity').value,
            payment_status: document.getElementById('payment_status').value
        });
        initOrders();
    } catch (error) {
        alert(error.message);
    }
};

window.loadOrders = async function loadOrders() {
    const search = document.getElementById('searchInput')?.value || '';
    const table = document.getElementById('orderTable');

    try {
        const { orders } = await apiGet('list_orders', { search });
        table.innerHTML = orders.length ? orders.map(o => `
            <tr>
                <td>${escapeHtml(o.order_no)}</td>
                <td>${escapeHtml(o.customer_name)}</td>
                <td>${escapeHtml(o.product_name)}</td>
                <td>${o.quantity}</td>
                <td>RM ${money(o.total)}</td>
                <td><span class="${o.payment_status === 'Unpaid' ? 'stock-out' : 'stock-ok'}">${escapeHtml(o.payment_status)}</span></td>
                <td><button class="btn-secondary" onclick="deleteOrder(${o.order_id})">Delete</button></td>
            </tr>
        `).join('') : '<tr><td colspan="7">No orders found.</td></tr>';
    } catch (error) {
        table.innerHTML = `<tr><td colspan="7">${escapeHtml(error.message)}</td></tr>`;
    }
};

window.deleteOrder = async function deleteOrder(id) {
    if (!confirm('Delete this order?')) return;
    try {
        await apiPost('delete_order', { order_id: id });
        loadOrders();
    } catch (error) {
        alert(error.message);
    }
};

window.clearOrderSearch = function clearOrderSearch() {
    document.getElementById('searchInput').value = '';
    loadOrders();
};

initOrders();
