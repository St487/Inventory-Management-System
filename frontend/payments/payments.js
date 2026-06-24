async function loadPayments() {
    const { payments } = await apiGet('payments');
    document.getElementById('paymentTable').innerHTML = payments.length ? payments.map(p => `
        <tr>
            <td>${escapeHtml(p.order_no)}</td>
            <td>RM ${money(p.total)}</td>
            <td><span class="${p.payment_status === 'Unpaid' ? 'stock-out' : 'stock-ok'}">${escapeHtml(p.payment_status)}</span></td>
            <td>${escapeHtml(p.note)}</td>
            <td>${escapeHtml(p.created_at)}</td>
        </tr>
    `).join('') : '<tr><td colspan="5">No payment records yet.</td></tr>';
}

loadPayments();
