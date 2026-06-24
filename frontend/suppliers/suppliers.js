async function loadSuppliers() {
    const table = document.getElementById('supplierTable');
    const search = document.getElementById('searchInput')?.value || '';
    table.innerHTML = '<tr><td colspan="6">Loading suppliers...</td></tr>';

    try {
        const { suppliers } = await apiGet('list_suppliers', { search });
        if (!suppliers.length) {
            table.innerHTML = '<tr><td colspan="6">No suppliers found.</td></tr>';
            return;
        }

        table.innerHTML = suppliers.map(s => `
            <tr onclick="openEditPage(${s.supplier_id})" class="clickable-row">
                <td><img src="${escapeHtml(s.logo_path)}" class="supplier-logo" alt=""></td>
                <td>${escapeHtml(s.supplier_code)}</td>
                <td>${escapeHtml(s.name)}</td>
                <td>${escapeHtml(s.email)}</td>
                <td>${escapeHtml(s.phone)}</td>
                <td>${escapeHtml(s.address)}</td>
            </tr>
        `).join('');
    } catch (error) {
        table.innerHTML = `<tr><td colspan="6">${escapeHtml(error.message)}</td></tr>`;
    }
}

function searchSupplier() {
    loadSuppliers();
}

function clearSearch() {
    document.getElementById('searchInput').value = '';
    loadSuppliers();
}

function openEditPage(id) {
    loadPage(`suppliers/edit_suppliers/edit_supplier.html?id=${id}`);
}

loadSuppliers();
showFlash();
