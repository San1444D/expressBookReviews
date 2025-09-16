const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }))

app.use("/customer/auth/", function auth(req, res, next) {

    if (req.session.authorization) {
        jwt.verify(req.session.authorization, "access", (err, user) => {
            if (!err) {
                req.user = user;
                next();
            }
        })
    }
    else {
        return res.status(403).json({ message: "User not authenticated" });
    }
});

// Register routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

// Error-handling middleware
app.use((err, req, res, next) => {

    res.status(err.status || 500).json({
        message: err.details?.code || err.code || err.message || "Internal Server Error",
        status: err.status || 500,
        ...((process.env.NODE_ENV === 'production') ? {} : { stack: err.stack }),
    });
});

const PORT = 5000;
app.listen(PORT, () => console.log("Server is running"));
