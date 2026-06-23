window.stocks = window.stocks || [

    {
        id: 1,
        thumbnail: "https://via.placeholder.com/40",
        code: "P001",
        name: "Wireless Mouse",
        price: 35.00,
        quantity: 50,
        supplier: "Tech Supply Co"
    },

    {
        id: 2,
        thumbnail: "https://via.placeholder.com/40",
        code: "P002",
        name: "Mechanical Keyboard",
        price: 120.00,
        quantity: 8,
        supplier: "Office Pro"
    },

    {
        id: 3,
        thumbnail: "https://via.placeholder.com/40",
        code: "P003",
        name: "27 Inch Monitor",
        price: 699.00,
        quantity: 0,
        supplier: "Global Electronics"
    },

    {
        id: 4,
        thumbnail: "https://via.placeholder.com/40",
        code: "P004",
        name: "USB Hub",
        price: 45.00,
        quantity: 15,
        supplier: "Tech Supply Co"
    }

];

function loadStocks(data = stocks) {

    const table = document.getElementById("stockTable");

    table.innerHTML = "";

    data.forEach(stock => {

        let status = "";

        if (stock.quantity === 0) {

            status =
            `<span class="stock-out">
                Out Of Stock
            </span>`;

        }
        else if (stock.quantity < 10) {

            status =
            `<span class="stock-low">
                Low Stock
            </span>`;

        }
        else {

            status =
            `<span class="stock-ok">
                Stock Available
            </span>`;
        }

        table.innerHTML += `
        <tr onclick="openEditPage(${stock.id})" class="clickable-row">

            <td>
                <img src="${stock.thumbnail}">
            </td>

            <td>${stock.code}</td>

            <td>${stock.name}</td>

            <td>${stock.price.toFixed(2)}</td>

            <td>${stock.quantity}</td>

            <td>${stock.supplier}</td>

            <td>${status}</td>

        </tr>
        `;
    });
}

function applyFilters() {

    const keyword =
        document.getElementById("searchInput")
        .value
        .toLowerCase();

    const supplier =
        document.getElementById("supplierFilter")
        .value;

    let filtered = stocks.filter(stock => {

        const matchKeyword =
            stock.name.toLowerCase().includes(keyword) ||
            stock.code.toLowerCase().includes(keyword);

        const matchSupplier =
            supplier === "" ||
            stock.supplier === supplier;

        return matchKeyword && matchSupplier;
    });

    loadStocks(filtered);
}

function clearFilters() {

    document.getElementById("searchInput").value = "";

    document.getElementById("supplierFilter").value = "";

    loadStocks();
}

if (typeof loadStocks === 'function') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadStocks);
    } else {
        loadStocks();
    }
}

function openEditPage(id) {
    loadPage(`stock/edit_stock/edit_stock.html?id=${id}`);
}