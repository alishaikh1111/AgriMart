const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const app = express();
const PORT = process.env.PORT || 5000;

// JSON data receive karne ke liye
app.use(express.json());
app.use(cors());
app.use(express.static("./"));
// Get all products
app.get("/api/products", (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) {
            console.error("Error fetching products:", err.message);
            return res.status(500).json({
                error: "Failed to fetch products"
            });
        }

        res.json(rows);
    });
});
const db = new sqlite3.Database(
    path.join(__dirname, "database.db"),
    (err) => {
        if (err) {
            console.error("Database connection failed:", err.message);
        } else {
            console.log("AgriMart database connected successfully!");
        }
    }
);
// ================= CREATE PRODUCTS TABLE =================
db.run(`
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        image TEXT
    )
`, (err) => {
    if (err) {
        console.error("Products table creation failed:", err.message);
    } else {
        console.log("Products table ready!");

        // Add default products only if table is empty
        db.get("SELECT COUNT(*) AS count FROM products", (err, row) => {
            if (err) {
                console.error("Product count error:", err.message);
                return;
            }

            if (row.count === 0) {
                const products = [
                    ["Premium Wheat Seeds", "High quality wheat seeds", 499, "wheat.jpg"],
                    ["Hybrid Corn Seeds", "High quality hybrid corn seeds", 599, "corn.jpg"],
                    ["Organic Fertilizer", "100% organic fertilizer", 749, "organic.jpg"],
                    ["NPK Fertilizer", "Balanced NPK fertilizer", 899, "npk.jpg"],
                    ["Crop Protection Spray", "Effective crop protection spray", 649, "spray.jpg"],
                    ["Bio Pesticide", "Natural bio pesticide", 549, "bio.jpg"],
                    ["Mini Cultivator", "Compact farming cultivator", 4999, "cultivator.jpg"],
                    ["Drip Irrigation Kit", "Efficient drip irrigation kit", 2499, "drip.jpg"]
                ];

                const stmt = db.prepare(`
                    INSERT INTO products
                    (name, description, price, image)
                    VALUES (?, ?, ?, ?)
                `);

                products.forEach(product => {
                    stmt.run(product);
                });

                stmt.finalize(() => {
                    console.log("Default products inserted!");
                });
            }
        });
    }
});
// Test API
app.get("/api/test", (req, res) => {
    res.json({
        message: "AgriMart Backend + Database is Working!"
    });
});

// Register User
app.post("/api/register", (req, res) => {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
        return res.status(400).json({
            error: "All fields are required"
        });
    }

    const sql = `
        INSERT INTO users (name, email, phone, password)
        VALUES (?, ?, ?, ?)
    `;

    db.run(sql, [name, email, phone, password], function(err) {
        if (err) {
            console.error("Registration error:", err.message);

            return res.status(400).json({
                error: "Email may already be registered"
            });
        }

        res.json({
            message: "User registered successfully",
            userId: this.lastID
        });
    });
});
// Login User
app.post("/api/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            error: "Email and password are required"
        });
    }

    const sql = `
        SELECT id, name, email, phone
        FROM users
        WHERE email = ? AND password = ?
    `;

    db.get(sql, [email, password], (err, user) => {
        if (err) {
            console.error("Login error:", err.message);

            return res.status(500).json({
                error: "Login failed"
            });
        }

        if (!user) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        res.json({
            message: "Login successful",
            user: user
        });
    });
});
// Create Order
app.post("/api/orders", (req, res) => {
    const { orderId, customer, payment, products, total } = req.body;

    if (!orderId || !customer || !products || products.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid order data"
        });
    }

    const sql = `
        INSERT INTO orders
        (order_id, customer_name, phone, email, address, city, state, pincode, payment, total, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
        sql,
        [
            orderId,
            customer.name,
            customer.phone,
            customer.email,
            customer.address,
            customer.city,
            customer.state,
            customer.pincode,
            payment,
            total,
            "Order Placed"
        ],
        function(err) {
            if (err) {
                console.error("Order error:", err.message);

                return res.status(500).json({
                    success: false,
                    message: "Failed to save order"
                });
            }

            res.json({
                success: true,
                message: "Order placed successfully",
                orderId: orderId
            });
        }
    );
});
// Get All Orders
app.get("/api/orders", (req, res) => {
    db.all(
        "SELECT * FROM orders ORDER BY order_date DESC",
        [],
        (err, rows) => {
            if (err) {
                console.error("Error fetching orders:", err.message);

                return res.status(500).json({
                    success: false,
                    message: "Failed to load orders"
                });
            }

            res.json(rows);
        }
    );
});
// Create Order
app.post("/api/orders", (req, res) => {
    const { orderId, customer, payment, products, total } = req.body;

    if (!products || products.length === 0) {
        return res.json({
            success: false,
            message: "Cart is empty"
        });
    }

    const userId = 1;

    db.run(
        `INSERT INTO orders (user_id, total_amount) VALUES (?, ?)`,
        [userId, total],
        function(err) {

            if (err) {
                console.error("Order Error:", err.message);

                return res.status(500).json({
                    success: false,
                    message: "Order could not be saved"
                });
            }

            const dbOrderId = this.lastID;

            let completed = 0;

            products.forEach(product => {

                db.run(
                    `INSERT INTO order_items
                    (order_id, product_id, quantity, price)
                    VALUES (?, ?, ?, ?)`,
                    [
                        dbOrderId,
                        product.product_id || 1,
                        product.quantity || 1,
                        product.price
                    ],
                    function(err) {

                        completed++;

                        if (err) {
                            console.error("Order Item Error:", err.message);
                        }

                        if (completed === products.length) {

                            res.json({
                                success: true,
                                message: "Order placed successfully!",
                                orderId: orderId
                            });

                        }
                    }
                );

            });
        }
    );
});
// Login API
app.post("/api/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            error: "Email and password are required"
        });
    }

    db.get(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, user) => {

            if (err) {
                console.error("Login error:", err.message);

                return res.status(500).json({
                    error: "Login failed"
                });
            }

            if (!user) {
                return res.status(401).json({
                    error: "Invalid email or password"
                });
            }

            if (user.password !== password) {
                return res.status(401).json({
                    error: "Invalid email or password"
                });
            }

            res.json({
                success: true,
                message: "Login successful",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        }
    );
});
app.post("/api/register", (req, res) => {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
        return res.status(400).json({
            error: "All fields are required"
        });
    }

    db.get(
        "SELECT id FROM users WHERE email = ?",
        [email],
        (err, user) => {

            if (err) {
                console.error("Register error:", err.message);
                return res.status(500).json({
                    error: "Registration failed"
                });
            }

            if (user) {
                return res.status(409).json({
                    error: "Email already registered"
                });
            }

            db.run(
                `INSERT INTO users 
                (name, email, password, role)
                VALUES (?, ?, ?, ?)`,
                [name, email, password, "customer"],
                function(err) {

                    if (err) {
                        console.error("Insert error:", err.message);

                        return res.status(500).json({
                            error: "Could not create account"
                        });
                    }

                    res.json({
                        success: true,
                        message: "Account created successfully!",
                        userId: this.lastID
                    });
                }
            );
        }
    );
});
// ADD SELLER PRODUCT
app.post("/api/seller/products", (req, res) => {

    const {
        name,
        category,
        price,
        stock,
        description,
        image,
        sellerName,
        location
    } = req.body;

    if (!name || !category || !price || !stock) {
        return res.status(400).json({
            error: "Required product fields are missing"
        });
    }

    db.run(
        `INSERT INTO products
        (name, category, price, stock, description, image, seller_name, location)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            name,
            category,
            Number(price),
            Number(stock),
            description,
            image,
            sellerName,
            location
        ],
        function(err) {

            if (err) {
                console.error("Seller product error:", err.message);

                return res.status(500).json({
                    error: "Product could not be added"
                });
            }

            res.json({
                success: true,
                message: "Product added successfully!",
                productId: this.lastID
            });
        }
    );
});
// ADMIN DASHBOARD API

app.get("/api/admin/stats", (req, res) => {

    db.get(
        "SELECT COUNT(*) AS totalUsers FROM users",
        [],
        (err, users) => {

            if (err) {
                console.error("Users Error:", err.message);
                return res.status(500).json({
                    error: "Users database error"
                });
            }

            db.get(
                "SELECT COUNT(*) AS totalOrders FROM orders",
                [],
                (err, orders) => {

                    if (err) {
                        console.error("Orders Error:", err.message);
                        return res.status(500).json({
                            error: "Orders database error"
                        });
                    }

                    db.get(
                        "SELECT COUNT(*) AS totalProducts FROM products",
                        [],
                        (err, products) => {

                            if (err) {
                                console.error("Products Error:", err.message);
                                return res.status(500).json({
                                    error: "Products database error"
                                });
                            }

                            db.get(
                                `SELECT COALESCE(
                                    SUM(price * quantity), 0
                                ) AS revenue
                                FROM order_items`,
                                [],
                                (err, revenue) => {

                                    if (err) {
                                        console.error(
                                            "Revenue Error:",
                                            err.message
                                        );

                                        return res.status(500).json({
                                            error: "Revenue database error"
                                        });
                                    }

                                    res.json({
                                        users: users.totalUsers,
                                        orders: orders.totalOrders,
                                        products: products.totalProducts,
                                        revenue: revenue.revenue
                                    });

                                }
                            );
                        }
                    );
                }
            );
        }
    );
});
app.get("/api/users", (req, res) => {

    db.all(
        "SELECT id, name, email FROM users",
        [],
        (err, rows) => {

            if (err) {
                console.error("Users Error:", err.message);

                return res.status(500).json({
                    error: "Failed to fetch users",
                    details: err.message
                });
            }

            res.json(rows);
        }
    );
});
app.listen(PORT, () => {
    console.log(`AgriMart server running on http://localhost:${PORT}`);
});