window.products = window.products || [
    { id: 1, code: "P001", name: "Mouse", price: 25, stock: 12, quantity: 12, image: "https://via.placeholder.com/50", active: true },
    { id: 2, code: "P002", name: "Keyboard", price: 80, stock: 5, quantity: 5, image: "https://via.placeholder.com/50", active: true },
    { id: 3, code: "P003", name: "Monitor", price: 300, stock: 0, quantity: 0, image: "https://via.placeholder.com/50", active: false }
];


// ===============================
// LOAD PRODUCTS
// ===============================
function loadProducts(data = products) {
    let table = document.getElementById("productTable");
    table.innerHTML = "";

    data.forEach(p => {

        let statusText = p.active ? "Active" : "Inactive";
        let statusClass = p.active ? "active" : "inactive";

        table.innerHTML += `
            <tr onclick="openEditPage(${p.id})" class="clickable-row">

                <td><img src="${p.image}" width="40"></td>

                <td>${p.code}</td>

                <td>${p.name}</td>

                <td>$${p.price}</td>

                <td>${p.quantity}</td>

                <td>${getStockBadge(p.stock)}</td>

                <td><span class="status-badge ${statusClass}">${statusText}</span></td>

            </tr>
        `;
    });
}

function getStockBadge(stock) {
    if (stock == 0) {
        return `<span class="stock-out">Out of Stock</span>`;
    } else if (stock < 10) {
        return `<span class="stock-low">Low Stock</span>`;
    } else {
        return `<span class="stock-ok">Stock Available</span>`;
    }
}

// ===============================
// TOGGLE FORM
// ===============================
function toggleForm() {
    let form = document.getElementById("formBox");
    form.style.display = (form.style.display === "block") ? "none" : "block";
}

// ===============================
// SAVE PRODUCT (ADD / UPDATE)
// ===============================
function saveProduct() {

    let id = document.getElementById("product_id").value;
    let code = document.getElementById("product_code").value;
    let name = document.getElementById("product_name").value;
    let price = document.getElementById("price").value;
    let stock = document.getElementById("stock").value;
    if (id == "") {
        // ADD
        let newProduct = {
            id: Date.now(),
            code,
            name,
            price,
            stock,
            image: "https://via.placeholder.com/50"
        };

        products.push(newProduct);
        alert("Product Added Successfully!");
    } else {
        // UPDATE
        products = products.map(p => {
            if (p.id == id) {
                return { ...p, code, name, price, stock };
            }
            return p;
        });

        alert("Product Updated Successfully!");
    }

    clearForm();
    loadProducts();
    toggleForm();
}

// ===============================
// SEARCH + FILTER PRODUCTS
// ===============================
function applyFilters() {

    let keyword = document.getElementById("searchInput").value.toLowerCase();
    let status = document.getElementById("statusFilter").value;

    let filtered = products.filter(p => {

        let matchSearch =
            p.name.toLowerCase().includes(keyword) ||
            p.code.toLowerCase().includes(keyword);

        let matchStatus =
            status === "" ||
            (status === "active" && p.active) ||
            (status === "inactive" && !p.active);

        return matchSearch && matchStatus;
    });

    loadProducts(filtered);
}

// ===============================
// CLEAR FILTERS
// ===============================
function clearFilters() {
    document.getElementById("searchInput").value = "";
    document.getElementById("statusFilter").value = "";
    loadProducts();
}


// ===============================
// NAVIGATE TO EDIT PAGE
// ===============================
function openEditPage(id) {
    loadPage(`products/edit_product/edit_product.html?id=${id}`);
}

// ===============================
// INIT LOAD
// ===============================
if (typeof loadProducts === 'function') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadProducts);
    } else {
        loadProducts();
    }
}