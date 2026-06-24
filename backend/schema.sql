CREATE DATABASE IF NOT EXISTS ims_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ims_db;

DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS suppliers;

CREATE TABLE suppliers (
    supplier_id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    phone VARCHAR(30) NOT NULL,
    address VARCHAR(255) NOT NULL,
    logo_path VARCHAR(255) NOT NULL DEFAULT 'assets/supplier-placeholder.png',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    phone VARCHAR(30) NOT NULL,
    vip_status ENUM('Gold','Silver','Normal') NOT NULL DEFAULT 'Normal',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stock (
    stock_id INT AUTO_INCREMENT PRIMARY KEY,

    image_path VARCHAR(255) NOT NULL,
    stock_code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(120) NOT NULL,

    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,

    supplier_id INT NOT NULL,

    status ENUM('Low Stock','Stock Available','Out of Stock') NOT NULL,

    stock_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_stock_supplier
        FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    stock_id INT NOT NULL,
    product_code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(120) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    image_path VARCHAR(255) NOT NULL DEFAULT 'assets/product-placeholder.png',
    status ENUM('active','inactive') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_product_stock
        FOREIGN KEY (stock_id) REFERENCES stock(stock_id)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    order_no VARCHAR(30) NOT NULL UNIQUE,
    customer_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    tax DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL,
    payment_status ENUM('Paid','Unpaid') NOT NULL DEFAULT 'Unpaid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_orders_customers
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_orders_products
        FOREIGN KEY (product_id) REFERENCES products(product_id)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

INSERT INTO suppliers (supplier_code, name, email, phone, address, logo_path) VALUES
('S001', 'Tech Supply Co', 'tech@supplier.com', '0123456789', 'Kuala Lumpur', 'assets/logos/tech-supply.png'),
('S002', 'Office Pro', 'office@pro.com', '0132233445', 'Johor Bahru', 'assets/logos/office-pro.png'),
('S003', 'Global Electronics', 'global@electronics.com', '0145566778', 'Penang', 'assets/logos/global-electronics.png');

INSERT INTO stock (image_path, stock_code, name, price, quantity, supplier_id, status) VALUES
('assets/products/wireless-mouse.png', 'STK001', 'Wireless Mouse Stock', 35.00, 50, 1, 'Stock Available'),
('assets/products/mechanical-keyboard.png', 'STK002', 'Mechanical Keyboard Stock', 120.00, 8, 2, 'Low Stock'),
('assets/products/monitor.png', 'STK003', '27 Inch Monitor Stock', 699.00, 0, 3, 'Out of Stock'),
('assets/products/usb-hub.png', 'STK004', 'USB Hub Stock', 45.00, 15, 1, 'Stock Available');

INSERT INTO products (stock_id, product_code, name, price, quantity, image_path, status) VALUES
(1, 'P001', 'Wireless Mouse', 35.00, 50, 'assets/products/wireless-mouse.png', 'active'),
(2, 'P002', 'Mechanical Keyboard', 120.00, 8, 'assets/products/mechanical-keyboard.png', 'active'),
(3, 'P003', '27 Inch Monitor', 699.00, 0, 'assets/products/monitor.png', 'inactive'),
(4, 'P004', 'USB Hub', 45.00, 15, 'assets/products/usb-hub.png', 'active');

INSERT INTO customers (name, email, phone, vip_status) VALUES
('Ali Ahmad', 'ali@gmail.com', '0121112222', 'Gold'),
('Siti Aminah', 'siti@gmail.com', '0133334444', 'Silver'),
('John Tan', 'john@gmail.com', '0145556666', 'Normal');

INSERT INTO orders (order_no, customer_id, product_id, quantity, subtotal, discount, tax, total, payment_status) VALUES
('ORD20260624001', 1, 1, 2, 70.00, 0.00, 4.20, 74.20, 'Paid'),
('ORD20260624002', 2, 2, 5, 600.00, 60.00, 32.40, 572.40, 'Unpaid');
