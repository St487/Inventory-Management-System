async function loadTransactions() {
    const { transactions } = await apiGet('transactions');
    const table = document.getElementById('transactionTable');
    table.innerHTML = transactions.length ? transactions.map(t => `
        <tr>
            <td>${escapeHtml(t.order_no)}</td>
            <td>${escapeHtml(t.customer_name)}</td>
            <td>${escapeHtml(t.product_name)}</td>
            <td>${t.quantity}</td>
            <td>RM ${money(t.subtotal)}</td>
            <td>RM ${money(t.discount)}</td>
            <td>RM ${money(t.tax)}</td>
            <td><strong>RM ${money(t.total)}</strong></td>
        </tr>
    `).join('') : '<tr><td colspan="9">No transactions yet.</td></tr>';
}

loadTransactions();
