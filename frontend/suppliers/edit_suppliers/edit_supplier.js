async function loadSupplier() {
    try {
        const { supplier } = await apiGet('get_supplier', {
            id: getCurrentPageParam('id')
        });

        document.getElementById('supplier_id').value = supplier.supplier_id;
        document.getElementById('supplier_code').value = supplier.supplier_code;
        document.getElementById('name').value = supplier.name;
        document.getElementById('email').value = supplier.email;
        document.getElementById('phone').value = supplier.phone;
        document.getElementById('address').value = supplier.address;
        document.getElementById('thumbnail_preview').src = '../backend/' + supplier.logo_path;

    } catch (error) {
        alert(error.message);
        loadPage('suppliers/suppliers.html');
    }
}

function previewSupplierLogo() {
    const input = document.getElementById('logo_path');
    const preview = document.getElementById('thumbnail_preview');
    const file = input.files[0];

    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
        alert('Only JPG, JPEG, PNG, and WEBP images are allowed.');
        input.value = '';
        return;
    }

    if (file.size > 2 * 1024 * 1024) {
        alert('Supplier logo must not exceed 2MB.');
        input.value = '';
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        preview.src = e.target.result;
    };

    reader.readAsDataURL(file);
}

async function updateSupplier() {
    try {
        const formData = new FormData();

        formData.append('supplier_id', document.getElementById('supplier_id').value);
        formData.append('supplier_code', document.getElementById('supplier_code').value);
        formData.append('name', document.getElementById('name').value);
        formData.append('email', document.getElementById('email').value);
        formData.append('phone', document.getElementById('phone').value);
        formData.append('address', document.getElementById('address').value);

        const file = document.getElementById('logo_path').files[0];
        if (file) {
            formData.append('logo_path', file);
        }

        try {
            await apiPost('save_supplier', formData);
            loadPage('suppliers/suppliers.html');
        } catch (err) {
            alert(err.message);
        }

    } catch (error) {
        alert(error.message);
    }
}

async function deleteSupplier() {
    if (!confirm('Delete this supplier? Products linked to it must be moved first.')) {
        return;
    }

    try {
        await apiPost('delete_supplier', {
            supplier_id: document.getElementById('supplier_id').value
        });

        loadPage('suppliers/suppliers.html');

    } catch (error) {
        alert(error.message);
    }
}

loadSupplier();