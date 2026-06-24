# Inventory Management System

Web-based business information system for STIJK3074 Assignment II.

## Technologies

- HTML, CSS, JavaScript
- PHP
- MySQL
- PDO prepared statements
- PHP sessions
- Chart.js for dashboard chart

## Setup

1. Start Apache and MySQL in XAMPP/WAMP.
2. Open phpMyAdmin.
3. Put this project inside your web server folder, for example:
   `C:\xampp\htdocs\Inventory-Management-System`
4. Run the database installer once:
   `http://localhost/Inventory-Management-System/backend/setup.php`
5. Open the system:
   `http://localhost/Inventory-Management-System/frontend/index.html`

The default database connection is in `backend/db.php`:

- Database: `ims_db`
- User: `root`
- Password: empty

## Assignment Feature Checklist

- CRUD operations: products and suppliers include add, display, update, delete, and wildcard search.
- Related database tables: suppliers, products, customers, and orders.
- Integer fields: ids, product quantity, order quantity.
- Unique fields: product code, supplier code, supplier email, customer email, order number.
- Image reference fields: product `image_path` and supplier `logo_path`.
- Calculation: order subtotal, 10% discount above RM500, 6% tax, total.
- Conditional logic: stock labels, payment warnings, discount logic, restock analysis.
- PDO and prepared statements: all API database operations in `backend/api.php`.
- Sessions: flash messages, remembered searches, last order number.
- Dashboard: summary cards, recent transactions, and stock chart.
- AI-assisted function: `AI Analysis` page generates rule-based business insights from database data.

## Video Presentation Notes

Show these files during explanation:

- `backend/schema.sql` for table relationships and unique/image/integer fields.
- `backend/db.php` for PDO connection and PHP session.
- `backend/api.php` for prepared statements, CRUD, calculation, conditional logic, and AI analysis.
- `frontend/api.js` for JavaScript to PHP data synchronization.
- Dashboard, Products, Suppliers, Orders, Payments, Transactions, and AI Analysis pages in the browser.
