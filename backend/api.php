<?php

require __DIR__ . '/db.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';
$data = input();

try {
    switch ($action) {
        case 'list_suppliers': listSuppliers(); break;
        case 'get_supplier': getSupplier(); break;
        case 'save_supplier': saveSupplier($data); break;
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
        case 'payments': payments(); break;
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
    $params = [
        'supplier_code' => trim(isset($data['supplier_code']) ? $data['supplier_code'] : ''),
        'name' => trim(isset($data['name']) ? $data['name'] : ''),
        'email' => trim(isset($data['email']) ? $data['email'] : ''),
        'phone' => trim(isset($data['phone']) ? $data['phone'] : ''),
        'address' => trim(isset($data['address']) ? $data['address'] : ''),
        'logo_path' => trim(isset($data['logo_path']) && $data['logo_path'] !== '' ? $data['logo_path'] : 'assets/supplier-placeholder.png')
    ];

    if ($params['supplier_code'] === '' || $params['name'] === '' || $params['email'] === '') {
        fail('Supplier code, name and email are required.');
    }

    if (!empty($data['supplier_id'])) {
        $params['supplier_id'] = intval($data['supplier_id']);
        $sql = 'UPDATE suppliers SET supplier_code=:supplier_code, name=:name, email=:email,
            phone=:phone, address=:address, logo_path=:logo_path WHERE supplier_id=:supplier_id';
        pdo()->prepare($sql)->execute($params);
        flashMessage('Supplier updated successfully.');
    } else {
        $sql = 'INSERT INTO suppliers (supplier_code, name, email, phone, address, logo_path)
            VALUES (:supplier_code, :name, :email, :phone, :address, :logo_path)';
        pdo()->prepare($sql)->execute($params);
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
        $where .= ' AND p.quantity > 0 AND p.quantity < 10';
    } elseif ($status === 'out') {
        $where .= ' AND p.quantity = 0';
    } elseif ($status === 'available') {
        $where .= ' AND p.quantity >= 10';
    }

    $sql = "SELECT p.*, s.name AS supplier_name
        FROM products p
        LEFT JOIN suppliers s ON s.supplier_id = p.supplier_id
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

function saveProduct($data)
{
    $params = [
        'product_code' => trim(isset($data['product_code']) ? $data['product_code'] : ''),
        'name' => trim(isset($data['name']) ? $data['name'] : ''),
        'price' => floatval(isset($data['price']) ? $data['price'] : 0),
        'quantity' => intval(isset($data['quantity']) ? $data['quantity'] : 0),
        'supplier_id' => intval(isset($data['supplier_id']) ? $data['supplier_id'] : 0),
        'image_path' => trim(isset($data['image_path']) && $data['image_path'] !== '' ? $data['image_path'] : 'assets/product-placeholder.png'),
        'status' => trim(isset($data['status']) ? $data['status'] : 'active')
    ];

    if ($params['product_code'] === '' || $params['name'] === '' || $params['supplier_id'] <= 0) {
        fail('Product code, name and supplier are required.');
    }

    if (!empty($data['product_id'])) {
        $params['product_id'] = intval($data['product_id']);
        $sql = 'UPDATE products SET product_code=:product_code, name=:name, price=:price,
            quantity=:quantity, supplier_id=:supplier_id, image_path=:image_path, status=:status
            WHERE product_id=:product_id';
        pdo()->prepare($sql)->execute($params);
        flashMessage('Product updated successfully.');
    } else {
        $sql = 'INSERT INTO products (product_code, name, price, quantity, supplier_id, image_path, status)
            VALUES (:product_code, :name, :price, :quantity, :supplier_id, :image_path, :status)';
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
    $sql = 'SELECT o.*, c.name AS customer_name, p.name AS product_name, p.product_code
        FROM orders o
        JOIN customers c ON c.customer_id = o.customer_id
        JOIN products p ON p.product_id = o.product_id
        WHERE o.order_no LIKE :search OR c.name LIKE :search OR p.name LIKE :search
        ORDER BY o.order_id DESC';
    $stmt = pdo()->prepare($sql);
    $stmt->execute(['search' => '%' . $search . '%']);
    ok(['orders' => $stmt->fetchAll()]);
}

function createOrder($data)
{
    $pdo = pdo();
    $productId = intval(isset($data['product_id']) ? $data['product_id'] : 0);
    $quantity = max(1, intval(isset($data['quantity']) ? $data['quantity'] : 1));
    $customerId = intval(isset($data['customer_id']) ? $data['customer_id'] : 0);
    $paymentStatus = trim(isset($data['payment_status']) ? $data['payment_status'] : 'Unpaid');

    if ($customerId <= 0 || $productId <= 0) {
        fail('Please select customer and product.');
    }

    try {
        $pdo->beginTransaction();

        $stmt = $pdo->prepare('SELECT * FROM products WHERE product_id = :id FOR UPDATE');
        $stmt->execute(['id' => $productId]);
        $product = $stmt->fetch();
        if (!$product) throw new Exception('Product not found.');
        if (intval($product['quantity']) < $quantity) throw new Exception('Not enough stock for this order.');

        $subtotal = money(floatval($product['price']) * $quantity);
        $discount = $subtotal > 500 ? money($subtotal * 0.10) : 0.00;
        $tax = money(($subtotal - $discount) * 0.06);
        $total = money($subtotal - $discount + $tax);
        $orderNo = 'ORD' . date('YmdHis') . rand(10, 99);

        $stmt = $pdo->prepare('INSERT INTO orders
            (order_no, customer_id, product_id, quantity, subtotal, discount, tax, total, payment_status)
            VALUES (:order_no, :customer_id, :product_id, :quantity, :subtotal, :discount, :tax, :total, :payment_status)');
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

        $stmt = $pdo->prepare('UPDATE products SET quantity = quantity - :quantity WHERE product_id = :product_id');
        $stmt->execute(['quantity' => $quantity, 'product_id' => $productId]);

        $pdo->commit();
        $_SESSION['last_order_no'] = $orderNo;
        flashMessage('Order ' . $orderNo . ' created. Total RM ' . number_format($total, 2));
        ok(['order_no' => $orderNo, 'total' => $total]);
    } catch (Exception $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        throw $e;
    }
}

function deleteOrder($data)
{
    $stmt = pdo()->prepare('DELETE FROM orders WHERE order_id = :id');
    $stmt->execute(['id' => intval(isset($data['order_id']) ? $data['order_id'] : 0)]);
    flashMessage('Order deleted successfully.');
    ok();
}

function dashboard()
{
    $pdo = pdo();
    $summary = [
        'total_products' => intval($pdo->query('SELECT COUNT(*) FROM products')->fetchColumn()),
        'total_customers' => intval($pdo->query('SELECT COUNT(*) FROM customers')->fetchColumn()),
        'total_orders' => intval($pdo->query('SELECT COUNT(*) FROM orders')->fetchColumn()),
        'total_stock' => intval($pdo->query('SELECT COALESCE(SUM(quantity),0) FROM products')->fetchColumn()),
        'total_sales' => money(floatval($pdo->query("SELECT COALESCE(SUM(total),0) FROM orders WHERE payment_status='Paid'")->fetchColumn())),
        'low_stock' => intval($pdo->query('SELECT COUNT(*) FROM products WHERE quantity > 0 AND quantity < 10')->fetchColumn()),
        'last_order_no' => isset($_SESSION['last_order_no']) ? $_SESSION['last_order_no'] : ''
    ];

    $chart = $pdo->query('SELECT name, quantity FROM products ORDER BY quantity ASC LIMIT 8')->fetchAll();
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

function payments()
{
    $stmt = pdo()->query("SELECT order_no, total, payment_status, created_at,
        CASE WHEN payment_status = 'Unpaid' THEN 'Payment pending - follow up required' ELSE 'Payment received' END AS note
        FROM orders ORDER BY order_id DESC");
    ok(['payments' => $stmt->fetchAll()]);
}

function analysis()
{
    $pdo = pdo();
    $low = $pdo->query('SELECT product_code, name, quantity FROM products WHERE quantity < 10 ORDER BY quantity ASC')->fetchAll();
    $best = $pdo->query('SELECT p.name, COALESCE(SUM(o.quantity),0) AS sold
        FROM products p LEFT JOIN orders o ON o.product_id = p.product_id
        GROUP BY p.product_id, p.name ORDER BY sold DESC LIMIT 5')->fetchAll();
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
