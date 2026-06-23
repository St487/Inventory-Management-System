window.customers = window.customers || [
    { id: 1, name: "Ali", email: "ali@gmail.com", phone: "0123456789", vip: "Gold", created_at: "2023-01-01" },
    { id: 2, name: "Siti", email: "siti@gmail.com", phone: "0132233445", vip: "Silver", created_at: "2023-01-02" },
    { id: 3, name: "John", email: "john@gmail.com", phone: "0145566778", vip: "Normal", created_at: "2023-01-03" }
];

// LOAD TABLE
function loadCustomers(data = customers) {

    let table = document.getElementById("customerTable");
    table.innerHTML = "";

    data.forEach(c => {

        let vipClass = "";
        if (c.vip === "Gold") vipClass = "vip-gold";
        else if (c.vip === "Silver") vipClass = "vip-silver";
        else vipClass = "vip-normal";

        table.innerHTML += `
            <tr>
                <td>${c.id}</td>
                <td>${c.name}</td>
                <td>${c.email}</td>
                <td>${c.phone}</td>
                <td><span class="${vipClass}">${c.vip}</span></td>
                <td>${c.created_at}</td>
            </tr>
        `;
    });
}

// TOGGLE FORM
function toggleForm() {
    let form = document.getElementById("formBox");
    form.style.display = (form.style.display === "block") ? "none" : "block";
}

// SEARCH
function searchCustomer() {
    let keyword = document.getElementById("searchInput").value.toLowerCase();

    let filtered = customers.filter(c =>
        c.name.toLowerCase().includes(keyword) ||
        c.email.toLowerCase().includes(keyword) ||
        c.phone.includes(keyword)
    );

    loadCustomers(filtered);
}

// CLEAR FORM
function clearForm() {
    document.getElementById("customer_id").value = "";
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("vip").value = "";
}

// Ensure table is loaded when this script is (re)inserted dynamically
if (typeof loadCustomers === 'function') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadCustomers);
    } else {
        loadCustomers();
    }
}