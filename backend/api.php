<?php

require __DIR__ . '/db.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';
$data = input();

try {
    switch ($action) {
        case 'list_suppliers': listSuppliers(); break;
        case 'list_suppliers_dropdown': listSuppliersDropdown(); break;
        case 'get_supplier': getSupplier(); break;
        case 'save_supplier': saveSupplier($data); break;
        case 'save_stock': saveStock($data); break;
        case 'list_stock': listStock(); break;
        case 'list_stock_dropdown': listStockDropdown(); break;
        case 'get_stock': getStock(); break;
        case 'delete_supplier': deleteSupplier($data); break;
        case 'list_products': listProducts(); break;
        case 'get_product': getProduct(); break;
        case 'save_product': saveProduct($data); break;
        case 'delete_product': deleteProduct($data); break;
        case 'list_customers': listCustomers(); break;
        case 'save_customer': saveCustomer($data); break;
        case 'delete_customer': deleteCustomer($data); break;
        case 'list_orders': listOrders(); break;
        case 'create_order': createOrder($data); break;
        case 'delete_order': deleteOrder($data); break;
        case 'dashboard': dashboard(); break;
        case 'transactions': transactions(); break;
        case 'analysis': analysis(); break;
        case 'flash': flash(); break;
        default: fail('Unknown API action: ' . $action, 404);
    }
} catch (PDOException $e) {
    fail('Database error: ' . $e->getMessage(), 500);
} catch (Exception $e) {
    fail($e->getMessage(), 500);
}

function rememberSearch($key)
{
    $search = trim(isset($_GET['search']) ? $_GET['search'] : '');
    $_SESSION[$key] = $search;
    return $search;
}

function flashMessage($message)
{
    $_SESSION['flash'] = $message;
}

function flash()
{
    $message = isset($_SESSION['flash']) ? $_SESSION['flash'] : '';
    unset($_SESSION['flash']);
    ok(['message' => $message]);
}

function listSuppliers()
{
    $search = rememberSearch('supplier_search');
    $stmt = pdo()->prepare('SELECT * FROM suppliers
        WHERE supplier_code LIKE :search OR name LIKE :search OR email LIKE :search OR phone LIKE :search
        ORDER BY supplier_id DESC');
    $stmt->execute(['search' => '%' . $search . '%']);
    ok(['suppliers' => $stmt->fetchAll()]);
}

function listSuppliersDropdown()
{
    $stmt = pdo()->prepare("
        SELECT supplier_id, name 
        FROM suppliers 
        ORDER BY name ASC
    ");
    $stmt->execute();

    ok([
        'suppliers' => $stmt->fetchAll()
    ]);
}

function getSupplier()
{
    $stmt = pdo()->prepare('SELECT * FROM suppliers WHERE supplier_id = :id');
    $stmt->execute(['id' => intval(isset($_GET['id']) ? $_GET['id'] : 0)]);
    $supplier = $stmt->fetch();
    if (!$supplier) fail('Supplier not found.', 404);
    ok(['supplier' => $supplier]);
}

function saveSupplier($data)
{
    $uploadFolder = __DIR__ . '/assets/suppliers/';

    if (!is_dir($uploadFolder)) {
        mkdir($uploadFolder, 0777, true);
    }

    $pdo = pdo();

    // Default fallback
$logoPath = 'assets/product-placeholder.png';

$pdo = pdo();
$existingLogo = null;

// GET EXISTING LOGO IF EDIT MODE
if (!empty($data['supplier_id'])) {
    $stmt = $pdo->prepare("
        SELECT logo_path 
        FROM suppliers 
        WHERE supplier_id = :supplier_id
    ");

    $stmt->execute([
        'supplier_id' => intval($data['supplier_id'])
    ]);

    $existingLogo = $stmt->fetchColumn();

    if (!empty($existingLogo)) {
        $logoPath = $existingLogo;
    }
}

// UPLOAD NEW LOGO (OVERRIDE OLD ONE ONLY IF NEW FILE EXISTS)
if (isset($_FILES['logo_path']) && $_FILES['logo_path']['error'] === UPLOAD_ERR_OK) {

    $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];

    $originalFileName = $_FILES['logo_path']['name'];
    $fileExtension = strtolower(pathinfo($originalFileName, PATHINFO_EXTENSION));

    if (!in_array($fileExtension, $allowedExtensions)) {
        fail('Only JPG, JPEG, PNG, and WEBP logo images are allowed.');
    }

    if ($_FILES['logo_path']['size'] > 2 * 1024 * 1024) {
        fail('Supplier logo must not exceed 2MB.');
    }

    $uploadFolder = __DIR__ . '/assets/suppliers/';
    if (!is_dir($uploadFolder)) {
        mkdir($uploadFolder, 0777, true);
    }

    $newFileName = uniqid('supplier_', true) . '.' . $fileExtension;
    $targetFile = $uploadFolder . $newFileName;

    if (!move_uploaded_file($_FILES['logo_path']['tmp_name'], $targetFile)) {
        fail('Failed to upload supplier logo.');
    }

    $logoPath = 'assets/suppliers/' . $newFileName;
}

    $params = [
        'supplier_code' => trim($data['supplier_code'] ?? ''),
        'name' => trim($data['name'] ?? ''),
        'email' => trim($data['email'] ?? ''),
        'phone' => trim($data['phone'] ?? ''),
        'address' => trim($data['address'] ?? ''),
        'logo_path' => $logoPath
    ];

    if (
        $params['supplier_code'] === '' ||
        $params['name'] === '' ||
        $params['email'] === '' ||
        $params['phone'] === '' ||
        $params['address'] === ''
    ) {
        fail('Supplier code, name, email, phone and address are required.');
    }

    if (!filter_var($params['email'], FILTER_VALIDATE_EMAIL)) {
        fail('Please enter a valid email address.');
    }

    if (!empty($data['supplier_id'])) {
        $params['supplier_id'] = intval($data['supplier_id']);

        $sql = "UPDATE suppliers SET
                    supplier_code = :supplier_code,
                    name = :name,
                    email = :email,
                    phone = :phone,
                    address = :address,
                    logo_path = :logo_path
                WHERE supplier_id = :supplier_id";

        $pdo->prepare($sql)->execute($params);

        flashMessage('Supplier updated successfully.');
    } else {
        $check = $pdo->prepare("
            SELECT COUNT(*)
            FROM suppliers
            WHERE supplier_code = :supplier_code
        ");
        $check->execute([
            'supplier_code' => $params['supplier_code']
        ]);

        if ($check->fetchColumn() > 0) {
            fail('Supplier code already exists.');
        }

        $sql = "INSERT INTO suppliers
                    (supplier_code, name, email, phone, address, logo_path)
                VALUES
                    (:supplier_code, :name, :email, :phone, :address, :logo_path)";

        $pdo->prepare($sql)->execute($params);

        flashMessage('Supplier added successfully.');
    }

    ok();
}

function deleteSupplier($data)
{
    $stmt = pdo()->prepare('DELETE FROM suppliers WHERE supplier_id = :id');
    $stmt->execute(['id' => intval(isset($data['supplier_id']) ? $data['supplier_id'] : 0)]);
    flashMessage('Supplier deleted successfully.');
    ok();
}

function listProducts()
{
    $search = rememberSearch('product_search');
    $status = trim(isset($_GET['status']) ? $_GET['status'] : '');
    $params = ['search' => '%' . $search . '%'];
    $where = 'WHERE (p.product_code LIKE :search OR p.name LIKE :search OR s.name LIKE :search)';

    if ($status === 'low') {
        $where .= ' AND s.quantity > 0 AND s.quantity < 10';
    } elseif ($status === 'out') {
        $where .= ' AND s.quantity = 0';
    } elseif ($status === 'available') {
        $where .= ' AND s.quantity >= 10';
    }

    $sql = "SELECT 
                p.*,
                s.quantity AS stock_quantity,
                s.status AS stock_status,
                s.name AS stock_name,
                sup.name AS supplier_name
            FROM products p
            JOIN stock s ON s.stock_id = p.stock_id
            LEFT JOIN suppliers sup ON sup.supplier_id = s.supplier_id
            $where
            ORDER BY p.product_id DESC";

    $stmt = pdo()->prepare($sql);
    $stmt->execute($params);

    ok(['products' => $stmt->fetchAll()]);
}

function getProduct()
{
    $stmt = pdo()->prepare('SELECT * FROM products WHERE product_id = :id');
    $stmt->execute(['id' => intval(isset($_GET['id']) ? $_GET['id'] : 0)]);
    $product = $stmt->fetch();
    if (!$product) fail('Product not found.', 404);
    ok(['product' => $product]);
}

function saveStock($data)
{
    $uploadFolder = __DIR__ . '/assets/products/';

    if (!is_dir($uploadFolder)) {
        mkdir($uploadFolder, 0777, true);
    }

    $imagePath = null;

    if (isset($_FILES['image_path']) && $_FILES['image_path']['error'] === UPLOAD_ERR_OK) {

        $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];

        $fileName = $_FILES['image_path']['name'];
        $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

        if (!in_array($fileExt, $allowedExtensions)) {
            fail('Only JPG, JPEG, PNG, WEBP allowed.');
        }

        if ($_FILES['image_path']['size'] > 2 * 1024 * 1024) {
            fail('Image must not exceed 2MB.');
        }

        $newFileName = uniqid('stock_', true) . '.' . $fileExt;
        $targetFile = $uploadFolder . $newFileName;

        if (!move_uploaded_file($_FILES['image_path']['tmp_name'], $targetFile)) {
            fail('Failed to upload image.');
        }

        $imagePath = 'assets/products/' . $newFileName;
    }

    $stockCode = trim($data['stock_code'] ?? '');
    $name = trim($data['name'] ?? '');
    $price = floatval($data['price'] ?? 0);
    $quantity = intval($data['quantity'] ?? 0);
    $supplierId = intval($data['supplier_id'] ?? 0);

    if ($stockCode === '' || $name === '' || $supplierId <= 0) {
        fail('Stock code, name and supplier are required.');
    }

    if ($price < 0 || $quantity < 0) {
        fail('Invalid price or quantity.');
    }

    if ($quantity <= 0) {
        $status = 'Out of Stock';
    } elseif ($quantity < 10) {
        $status = 'Low Stock';
    } else {
        $status = 'Stock Available';
    }

    $pdo = pdo();

    if (!empty($data['stock_id'])) {

        // GET existing image first
        $stmt = $pdo->prepare("SELECT image_path FROM stock WHERE stock_id = :id");
        $stmt->execute(['id' => $data['stock_id']]);
        $existing = $stmt->fetch();

        if (!$imagePath) {
            $imagePath = $existing['image_path']; // KEEP OLD IMAGE
        }

        $sql = "UPDATE stock SET
                    stock_code = :stock_code,
                    name = :name,
                    price = :price,
                    quantity = :quantity,
                    supplier_id = :supplier_id,
                    image_path = :image_path,
                    status = :status
                WHERE stock_id = :stock_id";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'stock_code' => $stockCode,
            'name' => $name,
            'price' => $price,
            'quantity' => $quantity,
            'supplier_id' => $supplierId,
            'image_path' => $imagePath,
            'status' => $status,
            'stock_id' => intval($data['stock_id'])
        ]);

        flashMessage('Stock updated successfully.');
    } else {

        // INSERT
        $sql = "INSERT INTO stock
                (stock_code, name, price, quantity, supplier_id, image_path, status)
                VALUES
                (:stock_code, :name, :price, :quantity, :supplier_id, :image_path, :status)";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'stock_code' => $stockCode,
            'name' => $name,
            'price' => $price,
            'quantity' => $quantity,
            'supplier_id' => $supplierId,
            'image_path' => $imagePath,
            'status' => $status
        ]);

        flashMessage('Stock added successfully.');
    }

    ok();
}

function listStock()
{
    $search = rememberSearch('stock_search');

    $stmt = pdo()->prepare("
        SELECT 
            s.stock_id,
            s.stock_code,
            s.name,
            s.price,
            s.quantity,
            s.image_path,
            s.status,
            sup.name AS supplier_name
        FROM stock s
        LEFT JOIN suppliers sup ON sup.supplier_id = s.supplier_id
        WHERE 
            s.stock_code LIKE :search 
            OR s.name LIKE :search
            OR sup.name LIKE :search
        ORDER BY s.stock_id DESC
    ");

    $stmt->execute([
        'search' => '%' . $search . '%'
    ]);

    ok([
        'stocks' => $stmt->fetchAll()
    ]);
}

function listStockDropdown()
{
    $stmt = pdo()->prepare("
        SELECT 
            stock_id,
            stock_code,
            quantity,
            name
        FROM stock
        ORDER BY stock_id DESC
    ");

    $stmt->execute();

    ok([
        'stocks' => $stmt->fetchAll()
    ]);
}

function getStock()
{
    $stmt = pdo()->prepare("
        SELECT s.*, sup.name AS supplier_name
        FROM stock s
        LEFT JOIN suppliers sup ON sup.supplier_id = s.supplier_id
        WHERE s.stock_id = :id
    ");

    $stmt->execute([
        'id' => intval($_GET['id'] ?? 0)
    ]);

    $stock = $stmt->fetch();

    if (!$stock) fail('Stock not found.', 404);

    ok(['stock' => $stock]);
}

function saveProduct($data)
{

     $stockId = intval($data['stock_id'] ?? 0);

    // 1. BLOCK DUPLICATE STOCK FIRST
    if (empty($data['product_id'])) {
        $stmt = pdo()->prepare("SELECT COUNT(*) FROM products WHERE stock_id = :stock_id");
        $stmt->execute(['stock_id' => $stockId]);

        if ($stmt->fetchColumn() > 0) {
            fail('This stock is already assigned to another product.');
        }
    }

    // 2. CHECK STOCK EXISTS
    $stmt = pdo()->prepare("SELECT quantity FROM stock WHERE stock_id = :id");
    $stmt->execute(['id' => $stockId]);
    $stock = $stmt->fetch();

    if (!$stock) {
        fail('Stock not found.');
    }

    // 3. VALIDATE QUANTITY
    $productQty = intval($data['quantity'] ?? 0);
    if ($productQty > $stock['quantity']) {
        fail("Product quantity cannot exceed stock quantity.");
    }

    $uploadFolder = __DIR__ . '/assets/products/';

    if (!is_dir($uploadFolder)) {
        mkdir($uploadFolder, 0777, true);
    }

    $pdo = pdo();

    $existingImage = null;

    if (!empty($data['product_id'])) {
        $stmt = $pdo->prepare("SELECT image_path FROM products WHERE product_id = :id");
        $stmt->execute(['id' => $data['product_id']]);
        $existing = $stmt->fetch();
        $existingImage = $existing['image_path'] ?? null;
    }

    $imagePath = $existingImage ?? 'assets/products/product-placeholder.jpg';

    if (isset($_FILES['image_path']) && $_FILES['image_path']['error'] === UPLOAD_ERR_OK) {

        $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];

        $originalFileName = $_FILES['image_path']['name'];
        $fileExtension = strtolower(pathinfo($originalFileName, PATHINFO_EXTENSION));

        if (!in_array($fileExtension, $allowedExtensions)) {
            fail('Only JPG, JPEG, PNG, and WEBP images are allowed.');
        }

        if ($_FILES['image_path']['size'] > 2 * 1024 * 1024) {
            fail('Image size must not exceed 2MB.');
        }

        $newFileName = uniqid('product_', true) . '.' . $fileExtension;

        $targetFile = $uploadFolder . $newFileName;

        if (!move_uploaded_file($_FILES['image_path']['tmp_name'], $targetFile)) {
            fail('Failed to upload product image.');
        }

        $imagePath = 'assets/products/' . $newFileName;
    }

    $params = [
        'product_code' => trim(isset($data['product_code']) ? $data['product_code'] : ''),
        'name' => trim(isset($data['name']) ? $data['name'] : ''),
        'price' => floatval(isset($data['price']) ? $data['price'] : 0),
        'quantity' => intval(isset($data['quantity']) ? $data['quantity'] : 0),
        'stock_id' => intval($data['stock_id'] ?? 0),
        'image_path' => $imagePath,
        'status' => trim(isset($data['status']) ? $data['status'] : 'active')
    ];

    if ($params['product_code'] === '' || $params['name'] === '' || $params['stock_id'] <= 0) {
        fail('Product code, name and stock are required.');
    }

    if (!empty($data['product_id'])) {
        $params['product_id'] = intval($data['product_id']);
        $sql = 'UPDATE products SET product_code=:product_code, name=:name, price=:price,
            quantity=:quantity, stock_id=:stock_id, image_path=:image_path, status=:status
            WHERE product_id=:product_id';
        pdo()->prepare($sql)->execute($params);
        flashMessage('Product updated successfully.');
    } else {
        $sql = 'INSERT INTO products (product_code, name, price, quantity, stock_id, image_path, status)
            VALUES (:product_code, :name, :price, :quantity, :stock_id, :image_path, :status)';
        pdo()->prepare($sql)->execute($params);
        flashMessage('Product added successfully.');
    }

    ok();
}

function deleteProduct($data)
{
    $stmt = pdo()->prepare('DELETE FROM products WHERE product_id = :id');
    $stmt->execute(['id' => intval(isset($data['product_id']) ? $data['product_id'] : 0)]);
    flashMessage('Product deleted successfully.');
    ok();
}

function listCustomers()
{
    $search = rememberSearch('customer_search');
    $vip = trim(isset($_GET['vip']) ? $_GET['vip'] : '');
    $params = ['search' => '%' . $search . '%'];
    $where = '(name LIKE :search OR email LIKE :search OR phone LIKE :search)';

    if ($vip !== '') {
        $where .= ' AND vip_status = :vip';
        $params['vip'] = $vip;
    }

    $stmt = pdo()->prepare("SELECT * FROM customers WHERE $where ORDER BY customer_id DESC");
    $stmt->execute($params);
    ok(['customers' => $stmt->fetchAll()]);
}

function saveCustomer($data)
{
    $name = trim(isset($data['name']) ? $data['name'] : '');
    $email = trim(isset($data['email']) ? $data['email'] : '');
    $phone = trim(isset($data['phone']) ? $data['phone'] : '');
    $vip = trim(isset($data['vip_status']) ? $data['vip_status'] : 'Normal');

    if ($name === '' || $email === '' || $phone === '') {
        fail('Customer name, email and phone are required.');
    }

    $stmt = pdo()->prepare('INSERT INTO customers (name, email, phone, vip_status)
        VALUES (:name, :email, :phone, :vip_status)');
    $stmt->execute([
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'vip_status' => $vip
    ]);
    flashMessage('Customer added successfully.');
    ok();
}

function deleteCustomer($data)
{
    $stmt = pdo()->prepare('DELETE FROM customers WHERE customer_id = :id');
    $stmt->execute(['id' => intval(isset($data['customer_id']) ? $data['customer_id'] : 0)]);
    flashMessage('Customer deleted successfully.');
    ok();
}

function listOrders()
{
    $search = rememberSearch('order_search');
    $payment = trim($_GET['payment'] ?? '');

    $sql = 'SELECT o.*, c.name AS customer_name, p.name AS product_name, p.product_code
        FROM orders o
        JOIN customers c ON c.customer_id = o.customer_id
        JOIN products p ON p.product_id = o.product_id
        WHERE (o.order_no LIKE :search 
            OR c.name LIKE :search 
            OR p.name LIKE :search)';

    $params = ['search' => '%' . $search . '%'];

    if ($payment === 'Paid' || $payment === 'Unpaid') {
        $sql .= ' AND o.payment_status = :payment';
        $params['payment'] = $payment;
    }

    $sql .= ' ORDER BY o.order_id DESC';

    $stmt = pdo()->prepare($sql);
    $stmt->execute($params);

    ok(['orders' => $stmt->fetchAll()]);
}

function createOrder($data)
{
    $pdo = pdo();

    $productId = intval($data['product_id'] ?? 0);
    $quantity = max(1, intval($data['quantity'] ?? 1));
    $customerId = intval($data['customer_id'] ?? 0);
    $paymentStatus = trim($data['payment_status'] ?? 'Unpaid');

    if ($customerId <= 0 || $productId <= 0) {
        fail('Please select customer and product.');
    }

    try {
        $pdo->beginTransaction();

        // 1. GET PRODUCT + STOCK (LOCKED)
        $stmt = $pdo->prepare("
            SELECT 
                p.product_id,
                p.stock_id,
                p.price AS product_price,
                p.quantity AS product_qty,
                s.quantity AS stock_qty
            FROM products p
            JOIN stock s ON s.stock_id = p.stock_id
            WHERE p.product_id = :id
            FOR UPDATE
        ");
        $stmt->execute(['id' => $productId]);
        $row = $stmt->fetch();

        if (!$row) {
            throw new Exception('Product not found.');
        }

        // 2. VALIDATE STOCK
        if ($row['stock_qty'] < $quantity) {
            throw new Exception('Not enough stock.');
        }

        // 3. PRICE LOGIC (PRODUCT PRICE ONLY)
        $price = floatval($row['product_price']);

        $subtotal = $price * $quantity;

        // discount only if subtotal > 500
        $discount = ($subtotal > 500) ? $subtotal * 0.10 : 0;

        // tax = (subtotal - discount) * 6%
        $tax = ($subtotal - $discount) * 0.06;

        $total = ($subtotal - $discount) + $tax;

        // 4. ORDER NUMBER
        $orderNo = 'ORD' . date('YmdHis') . rand(10, 99);

        // 5. INSERT ORDER
        $stmt = $pdo->prepare("
            INSERT INTO orders
            (order_no, customer_id, product_id, quantity, subtotal, discount, tax, total, payment_status)
            VALUES
            (:order_no, :customer_id, :product_id, :quantity, :subtotal, :discount, :tax, :total, :payment_status)
        ");

        $stmt->execute([
            'order_no' => $orderNo,
            'customer_id' => $customerId,
            'product_id' => $productId,
            'quantity' => $quantity,
            'subtotal' => $subtotal,
            'discount' => $discount,
            'tax' => $tax,
            'total' => $total,
            'payment_status' => $paymentStatus
        ]);

        // 6. UPDATE STOCK
        $stmt = $pdo->prepare("
            UPDATE stock 
            SET quantity = quantity - :qty
            WHERE stock_id = :stock_id
        ");

        $stmt->execute([
            'qty' => $quantity,
            'stock_id' => $row['stock_id']
        ]);

        // 7. UPDATE PRODUCT QUANTITY (IMPORTANT FIX)
        $stmt = $pdo->prepare("
            UPDATE products 
            SET quantity = quantity - :qty
            WHERE product_id = :product_id
        ");

        $stmt->execute([
            'qty' => $quantity,
            'product_id' => $productId
        ]);

        // 8. COMMIT
        $pdo->commit();

        $_SESSION['last_order_no'] = $orderNo;
        flashMessage("Order $orderNo created successfully.");

        ok([
            'order_no' => $orderNo,
            'subtotal' => $subtotal,
            'discount' => $discount,
            'tax' => $tax,
            'total' => $total
        ]);

    } catch (Exception $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        throw $e;
    }
}

function deleteOrder($data)
{
    $pdo = pdo();

    $orderId = intval($data['order_id'] ?? 0);

    if ($orderId <= 0) {
        fail('Invalid order ID.');
    }

    try {
        $pdo->beginTransaction();

        // 1. GET ORDER DETAILS
        $stmt = $pdo->prepare("
            SELECT product_id, quantity
            FROM orders
            WHERE order_id = :id
            FOR UPDATE
        ");
        $stmt->execute(['id' => $orderId]);
        $order = $stmt->fetch();

        if (!$order) {
            throw new Exception('Order not found.');
        }

        $productId = $order['product_id'];
        $qty = intval($order['quantity']);

        // 2. GET STOCK ID FROM PRODUCT
        $stmt = $pdo->prepare("
            SELECT stock_id 
            FROM products 
            WHERE product_id = :id
        ");
        $stmt->execute(['id' => $productId]);
        $product = $stmt->fetch();

        if (!$product) {
            throw new Exception('Product not found.');
        }

        $stockId = $product['stock_id'];

        // 3. RESTORE STOCK
        $stmt = $pdo->prepare("
            UPDATE stock 
            SET quantity = quantity + :qty 
            WHERE stock_id = :stock_id
        ");
        $stmt->execute([
            'qty' => $qty,
            'stock_id' => $stockId
        ]);

        // 4. RESTORE PRODUCT QUANTITY
        $stmt = $pdo->prepare("
            UPDATE products 
            SET quantity = quantity + :qty 
            WHERE product_id = :product_id
        ");
        $stmt->execute([
            'qty' => $qty,
            'product_id' => $productId
        ]);

        // 5. DELETE ORDER
        $stmt = $pdo->prepare("
            DELETE FROM orders 
            WHERE order_id = :id
        ");
        $stmt->execute(['id' => $orderId]);

        $pdo->commit();

        flashMessage('Order deleted and stock restored successfully.');
        ok();

    } catch (Exception $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        throw $e;
    }
}

function dashboard()
{
    $pdo = pdo();

    $summary = [
        'total_products' => intval($pdo->query('SELECT COUNT(*) FROM products')->fetchColumn()),
        'total_customers' => intval($pdo->query('SELECT COUNT(*) FROM customers')->fetchColumn()),
        'total_orders' => intval($pdo->query('SELECT COUNT(*) FROM orders')->fetchColumn()),
        
        // STOCK is now source of truth
        'total_stock' => intval($pdo->query('SELECT COALESCE(SUM(quantity),0) FROM stock')->fetchColumn()),

        'total_sales' => money(floatval($pdo->query("SELECT COALESCE(SUM(total),0) FROM orders WHERE payment_status='Paid'")->fetchColumn())),

        'total_profit' => money(floatval($pdo->query("
            SELECT COALESCE(SUM(
                o.total - (s.price * o.quantity)
            ),0)
            FROM orders o
            JOIN products p ON p.product_id = o.product_id
            JOIN stock s ON s.stock_id = p.stock_id
            WHERE o.payment_status = 'Paid'
        ")->fetchColumn())),

        'low_stock' => intval($pdo->query('SELECT COUNT(*) FROM stock WHERE quantity > 0 AND quantity < 10')->fetchColumn()),

        'last_order_no' => $_SESSION['last_order_no'] ?? ''
    ];

    $chart = $pdo->query('SELECT name, quantity FROM stock ORDER BY quantity ASC LIMIT 8')->fetchAll();

    $recent = $pdo->query('SELECT order_no, total, payment_status, created_at FROM orders ORDER BY order_id DESC LIMIT 5')->fetchAll();

    ok(['summary' => $summary, 'chart' => $chart, 'recent' => $recent]);
}

function transactions()
{
    $stmt = pdo()->query('SELECT o.order_no, c.name AS customer_name, p.name AS product_name,
        o.quantity, o.subtotal, o.discount, o.tax, o.total, o.payment_status, o.created_at
        FROM orders o
        JOIN customers c ON c.customer_id = o.customer_id
        JOIN products p ON p.product_id = o.product_id
        ORDER BY o.order_id DESC');
    ok(['transactions' => $stmt->fetchAll()]);
}

function analysis()
{
    $pdo = pdo();
    $low = $pdo->query('SELECT stock_code, name, quantity FROM stock WHERE quantity < 10 ORDER BY quantity ASC')->fetchAll();

    $best = $pdo->query('
        SELECT s.name, COALESCE(SUM(o.quantity),0) AS sold
        FROM stock s
        JOIN products p ON p.stock_id = s.stock_id
        LEFT JOIN orders o ON o.product_id = p.product_id
        GROUP BY s.stock_id, s.name
        ORDER BY sold DESC
        LIMIT 5
    ')->fetchAll();
    $sales = money(floatval($pdo->query("SELECT COALESCE(SUM(total),0) FROM orders WHERE payment_status='Paid'")->fetchColumn()));
    $unpaid = intval($pdo->query("SELECT COUNT(*) FROM orders WHERE payment_status='Unpaid'")->fetchColumn());

    $insights = [];
    if ($sales >= 1000) {
        $insights[] = 'Sales are healthy. Continue promoting the best-selling products and keep stock available.';
    } else {
        $insights[] = 'Sales are still below RM1000. Consider a bundle or discount campaign for slow-moving items.';
    }

    if (count($low) > 0) {
        $names = [];
        foreach ($low as $product) {
            $names[] = $product['name'] . ' (' . $product['quantity'] . ')';
        }
        $insights[] = 'Restock priority: ' . implode(', ', $names);
    } else {
        $insights[] = 'Stock levels are stable. No urgent restock action is required.';
    }

    if ($unpaid > 0) {
        $insights[] = $unpaid . ' unpaid order(s) need payment follow-up.';
    }
    if (!empty($best[0]) && intval($best[0]['sold']) > 0) {
        $insights[] = 'Best-selling product: ' . $best[0]['name'] . ' with ' . $best[0]['sold'] . ' unit(s) sold.';
    }

    ok(['insights' => $insights, 'low_stock' => $low, 'best_sellers' => $best, 'total_sales' => $sales]);
}
