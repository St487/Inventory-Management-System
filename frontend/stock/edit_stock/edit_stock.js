function getStockId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

// MOCK DATA
let stocks = [
    {
        thumbnail: "https://via.placeholder.com/40",
        code: "P001",
        name: "Wireless Mouse",
        price: 35.00,
        quantity: 50,
        supplier: "Tech Supply Co"
    },

    {
        thumbnail: "https://via.placeholder.com/40",
        code: "P002",
        name: "Mechanical Keyboard",
        price: 120.00,
        quantity: 8,
        supplier: "Office Pro"
    },

    {
        thumbnail: "https://via.placeholder.com/40",
        code: "P003",
        name: "27 Inch Monitor",
        price: 699.00,
        quantity: 0,
        supplier: "Global Electronics"
    },

    {
        thumbnail: "https://via.placeholder.com/40",
        code: "P004",
        name: "USB Hub",
        price: 45.00,
        quantity: 15,
        supplier: "Tech Supply Co"
    }
];

function loadStock() {

    let id = getStockId();

    let stock = stocks.find(s => s.id == id);

    if (stock) {

        document.getElementById("stock_id").value = stock.id;
        document.getElementById("stock_code").value = stock.code;
        document.getElementById("stock_name").value = stock.name;
        document.getElementById("stock_price").value = stock.price;
        document.getElementById("stock_quantity").value = stock.quantity;
        document.getElementById("stock_supplier").value = stock.supplier;
    }
}

function updateStock() {

    alert("Stock updated successfully!");

    loadPage("stocks/stocks.html");
}

function deleteStock() {

    if (confirm("Are you sure you want to delete this stock?")) {

        alert("Stock deleted successfully!");

        loadPage("stocks/stocks.html");
    }
}

loadStock();