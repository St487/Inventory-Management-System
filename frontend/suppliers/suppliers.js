window.suppliers = window.suppliers || [
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

// LOAD TABLE
function loadSuppliers(data = suppliers) {

    let table = document.getElementById("supplierTable");
    table.innerHTML = "";

    data.forEach(s => {

        let statusClass = s.status === "Active"
            ? "status-active"
            : "status-inactive";

        table.innerHTML += `
            <tr onclick="openEditPage('${s.id}')" class="clickable-row">
            
                <td><img src="${s.logo}" class="supplier-logo"></td>
                <td>${s.id}</td>
                <td>${s.name}</td>
                <td>${s.email}</td>
                <td>${s.phone}</td>
                <td>${s.address}</td>
            </tr>
        `;
    });
}

// SEARCH
function searchSupplier() {

    let keyword = document.getElementById("searchInput").value.toLowerCase();

    let filtered = suppliers.filter(s =>
        s.name.toLowerCase().includes(keyword) ||
        s.email.toLowerCase().includes(keyword) ||
        s.phone.includes(keyword)
    );

    loadSuppliers(filtered);
}

// CLEAR
function clearSearch() {
    document.getElementById("searchInput").value = "";
    loadSuppliers();
}

if (typeof loadSuppliers === 'function') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadSuppliers);
    } else {
        loadSuppliers();
    }
}

function openEditPage(id) {
    loadPage(`suppliers/edit_suppliers/edit_supplier.html?id=${id}`);
}
