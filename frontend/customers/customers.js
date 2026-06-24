async function loadCustomers() {
    const table = document.getElementById('customerTable');
    const search = document.getElementById('searchInput')?.value || '';
    const vip = document.getElementById('vipFilter')?.value || '';
    table.innerHTML = '<tr><td colspan="6">Loading customers...</td></tr>';

    try {
        const { customers } = await apiGet('list_customers', { search, vip });
        if (!customers.length) {
            table.innerHTML = '<tr><td colspan="6">No customers found.</td></tr>';
            return;
        }

        table.innerHTML = customers.map(c => {
            const vipClass = c.vip_status === 'Gold' ? 'vip-gold' : c.vip_status === 'Silver' ? 'vip-silver' : 'vip-normal';
            return `
                <tr>
                    <td>${c.customer_id}</td>
                    <td>${escapeHtml(c.name)}</td>
                    <td>${escapeHtml(c.email)}</td>
                    <td>${escapeHtml(c.phone)}</td>
                    <td><span class="${vipClass}">${escapeHtml(c.vip_status)}</span></td>
                    <td>${escapeHtml(c.created_at)}</td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        table.innerHTML = `<tr><td colspan="6">${escapeHtml(error.message)}</td></tr>`;
    }
}

function toggleCustomerForm() {
    const box = document.getElementById('customerFormBox');
    box.style.display = box.style.display === 'none' ? 'block' : 'none';
}

async function saveCustomer() {
    try {
        await apiPost('save_customer', {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            vip_status: document.getElementById('vip_status').value
        });
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('phone').value = '';
        document.getElementById('vip_status').value = 'Normal';
        document.getElementById('customerFormBox').style.display = 'none';
        loadCustomers();
        showFlash();
    } catch (error) {
        alert(error.message);
    }
}

function searchCustomer() {
    loadCustomers();
}

function clearFilter() {
    document.getElementById('searchInput').value = '';
    document.getElementById('vipFilter').value = '';
    loadCustomers();
}

loadCustomers();
showFlash();
