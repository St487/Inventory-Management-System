function saveStock() {

    let code = document.getElementById("stockCode").value;
    let name = document.getElementById("stockName").value;
    let price = document.getElementById("stockPrice").value;
    let quantity = document.getElementById("stockQuantity").value;
    let supplier = document.getElementById("stockSupplier").value;

    if (
        code === "" ||
        name === "" ||
        price === "" ||
        quantity === "" ||
        supplier === ""
    ) {
        alert("Please fill in all fields.");
        return;
    }

    alert("Stock saved successfully!");

    loadPage("stocks/stocks.html");
}