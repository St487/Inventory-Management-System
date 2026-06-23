function getProductId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

// MOCK DATA (replace later with PHP)
let products = [
    { id: 1, code: "P001", name: "Mouse", price: 25, stock: 10 },
    { id: 2, code: "P002", name: "Keyboard", price: 80, stock: 5 },
    { id: 3, code: "P003", name: "Monitor", price: 300, stock: 0 }
];

function loadProduct() {
    let id = getProductId();

    let product = products.find(p => p.id == id);

    if (product) {
        document.getElementById("product_id").value = product.id;
        document.getElementById("product_code").value = product.code;
        document.getElementById("product_name").value = product.name;
        document.getElementById("price").value = product.price;
        document.getElementById("stock").value = product.stock;
    }
}

function updateProduct() {
    alert("Product updated successfully!");

    loadPage("products/products.html");
}

function deleteProduct() {
    
}

loadProduct();