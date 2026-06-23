const pageTitles = {
    'dashboard/dashboard.html': 'Dashboard Overview',
    'products/products.html': 'Product Management',
    'products/add_product/add_product.html': 'Add Product',
    'products/edit_product/edit_product.html': 'Edit Product',
    'stock/add_stock/add_stock.html': 'Add Stock',
    'stock/edit_stock/edit_stock.html': 'Edit Stock',
    'stock/stock.html': 'Stock Overview',
    'customers/customers.html': 'Customer Management',
    'suppliers/add_suppliers/add_supplier.html': 'Add Supplier',
    'suppliers/edit_suppliers/edit_supplier.html': 'Edit Supplier',
    'suppliers/suppliers.html': 'Supplier Management',
    'ai_analysis/ai_analysis.html': 'AI Analysis',
    'orders/orders.html': 'Orders Overview',
    'payments/payments.html': 'Payments Overview',
    'transactions/transactions.html': 'Transaction History'
};

function loadPage(page) {

    localStorage.setItem("currentPage", page);
    const route = page.split('?')[0];

    // Update active sidebar menu item
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');

        if (
            item.dataset.page === route ||
            (item.dataset.group && route.startsWith(item.dataset.group))
        ) {
            item.classList.add('active');
        }
    });

    // Update topbar heading to match current page
    const topbarTitle = document.querySelector('.topbar h3');
    if (topbarTitle) {
        topbarTitle.textContent = pageTitles[route] || 'Page Overview';
    }

    fetch(page)
    .then(response => response.text())
    .then(data => {
        document.getElementById('content').innerHTML = data;

        // Remove any previously loaded module script
        let oldScript = document.getElementById('moduleScript');
        if (oldScript) oldScript.remove();

        // Load a page-specific JS file if required
        let scriptSrc = null;
        if (page.includes('products/add_product')) {
            scriptSrc = 'products/add_product/add_product.js';
        } else if (page.includes('products/edit_product')) {
            scriptSrc = 'products/edit_product/edit_product.js';
        } else if (page.includes('products')) {
            scriptSrc = 'products/products.js';
        } else if (page.includes('stock/add_stock')) {
            scriptSrc = 'stock/add_stock/add_stock.js';
        } else if (page.includes('stock/edit_stock')) {
            scriptSrc = 'stock/edit_stock/edit_stock.js';
        } else if (page.includes('stock')) {
            scriptSrc = 'stock/stock.js';
        } else if (page.includes('customers')) {
            scriptSrc = 'customers/customers.js';
        } else if (page.includes('suppliers/add_suppliers')) {
            scriptSrc = 'suppliers/add_suppliers/add_supplier.js';
        } else if (page.includes('suppliers/edit_suppliers')) {
            scriptSrc = 'suppliers/edit_suppliers/edit_supplier.js';
        } else if (page.includes('suppliers')) {
            scriptSrc = 'suppliers/suppliers.js';
        }

        if (scriptSrc) {
            let script = document.createElement('script');
            script.id = 'moduleScript';
            script.src = scriptSrc;
            document.body.appendChild(script);
        }
    })
    .catch(error => {
        document.getElementById('content').innerHTML =
            '<div style="text-align:center;padding:40px;color:#ef4444;">' +
            '<i class="fa-solid fa-circle-exclamation" style="font-size:2rem;margin-bottom:10px;"></i>' +
            '<h3>Error loading page</h3>' +
            '<p style="color:#64748b;margin-top:5px;">Please check your connections or file path.</p>' +
            '</div>';
        console.log(error);
    });
}

// Load saved page on refresh and keep current page across reloads
(function () {
    const savedPage = localStorage.getItem('currentPage');
    const initialPage = savedPage || 'dashboard/dashboard.html';

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => loadPage(initialPage));
    } else {
        loadPage(initialPage);
    }
})();