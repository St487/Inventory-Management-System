function getSupplierId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

// MOCK DATA (replace with PHP/API later)
let suppliers = [
    {
        id: "S001",
        name: "Tech Supply Co",
        email: "tech@supplier.com",
        phone: "0123456789",
        address: "Kuala Lumpur",
        logo: "https://via.placeholder.com/40"
    },
    {
        id: "S002",
        name: "Office Pro",
        email: "office@pro.com",
        phone: "0132233445",
        address: "Johor Bahru",
        logo: "https://via.placeholder.com/40"
    },
    {
        id: "S003",
        name: "Global Electronics",
        email: "global@electronics.com",
        phone: "0145566778",
        address: "Penang",
        logo: "https://via.placeholder.com/40"
    }
];

function loadSupplier() {

    let id = getSupplierId();

    let supplier = suppliers.find(s => s.id == id);

    if (supplier) {

        document.getElementById("supplier_id").value = supplier.id;
        document.getElementById("supplier_name").value = supplier.name;
        document.getElementById("supplier_email").value = supplier.email;
        document.getElementById("supplier_phone").value = supplier.phone;
        document.getElementById("supplier_address").value = supplier.address;

    }
}

function updateSupplier() {

    alert("Supplier updated successfully!");

    loadPage("suppliers/suppliers.html");
}

function deleteSupplier() {

    if (confirm("Are you sure you want to delete this supplier?")) {

        alert("Supplier deleted successfully!");

        loadPage("suppliers/suppliers.html");
    }
}

loadSupplier();