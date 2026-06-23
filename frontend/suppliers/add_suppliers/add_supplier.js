function saveSupplier() {

    const name = document.getElementById("supplierName").value;
    const email = document.getElementById("supplierEmail").value;
    const phone = document.getElementById("supplierPhone").value;
    const address = document.getElementById("supplierAddress").value;

    if (!name || !email || !phone || !address) {
        alert("Please fill in all required fields.");
        return;
    }

    // Save logic here (LocalStorage / API / PHP)

    alert("Supplier saved successfully!");

    loadPage('suppliers/suppliers.html');
}
