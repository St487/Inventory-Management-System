const API_BASE = (() => {
    if (window.location.protocol === 'file:') {
        return '../backend/api.php';
    }

    const path = window.location.pathname;
    const marker = '/frontend/';
    const basePath = path.includes(marker)
        ? path.substring(0, path.indexOf(marker))
        : path.replace(/\/frontend\/?$/, '');

    return `${basePath}/backend/api.php`;
})();

function apiUrl(action, params = {}) {
    const query = new URLSearchParams({ action, ...params });
    return `${API_BASE}?${query.toString()}`;
}

async function apiGet(action, params = {}) {
    const response = await fetch(apiUrl(action, params));
    const payload = await parseApiResponse(response);
    if (!payload.success) throw new Error(payload.message || 'Request failed');
    return payload;
}

async function apiPost(action, data = {}) {
    const response = await fetch(apiUrl(action), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const payload = await parseApiResponse(response);
    if (!payload.success) throw new Error(payload.message || 'Request failed');
    return payload;
}

async function parseApiResponse(response) {
    const text = await response.text();
    try {
        return JSON.parse(text);
    } catch (error) {
        if (window.location.protocol === 'file:') {
            throw new Error('Open the system using http://localhost/... not by double-clicking index.html.');
        }
        throw new Error(`API did not return JSON. Check XAMPP/PHP. URL: ${response.url}. Response: ${text.substring(0, 160)}`);
    }
}

function getCurrentPageParam(name) {
    const page = localStorage.getItem('currentPage') || '';
    const query = page.includes('?') ? page.substring(page.indexOf('?')) : '';
    return new URLSearchParams(query).get(name);
}

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    }[char]));
}

function money(value) {
    return Number(value || 0).toFixed(2);
}

async function showFlash() {
    try {
        const { message } = await apiGet('flash');
        if (message) alert(message);
    } catch (error) {
        console.warn(error);
    }
}
