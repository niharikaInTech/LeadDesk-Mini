const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Lead = require("./models/Lead");

const app = express();
const port = process.env.PORT || 5000;

// Allow frontend requests
app.use(cors());

// Read JSON data from requests
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(function () {
        console.log("MongoDB connected");
    })
    .catch(function (error) {
        console.log("MongoDB connection failed");
        console.log(error.message);
    });

// Check JWT token before opening admin APIs
function verifyToken(req, res, next) {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        return res.status(401).json({
            message: "Please login to access the admin dashboard"
        });
    }

    const parts = authorizationHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).json({
            message: "Invalid authorization format"
        });
    }

    const token = parts[1];

    try {
        const decodedData = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.admin = decodedData;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Your login has expired. Please login again."
        });
    }
}

// Home route
app.get("/", function (req, res) {
    res.send("Welcome to LeadDesk Mini Backend");
});

// Admin login route
app.post("/login", function (req, res) {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    if (email !== process.env.ADMIN_EMAIL) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }

    if (!process.env.ADMIN_PASSWORD_HASH) {
        return res.status(500).json({
            message: "Admin password is not configured"
        });
    }

    bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH)
        .then(function (passwordMatches) {
            if (!passwordMatches) {
                return res.status(401).json({
                    message: "Invalid email or password"
                });
            }

            const token = jwt.sign(
                {
                    email: email,
                    role: "admin"
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "2h"
                }
            );

            res.json({
                message: "Login successful",
                token: token
            });
        })
        .catch(function (error) {
            console.log(error);

            res.status(500).json({
                message: "Login failed"
            });
        });
});

// Add a new lead
app.post("/add-lead", function (req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const budget = req.body.budget;
    const message = req.body.message;

    if (!name || !email || !budget || !message) {
        return res.status(400).json({
            message: "Please fill all the fields"
        });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        return res.status(400).json({
            message: "Please enter a valid email address"
        });
    }

    const newLead = new Lead({
        name: name,
        email: email,
        budget: budget,
        message: message
    });

    newLead.save()
        .then(function () {
            res.status(201).json({
                message: "Lead submitted successfully"
            });
        })
        .catch(function (error) {
            console.log(error);

            res.status(500).json({
                message: "Something went wrong while saving the lead"
            });
        });
});

// Get all leads - protected route
app.get("/leads", verifyToken, function (req, res) {
    const search = req.query.search || "";

    Lead.find({
        $or: [
            {
                name: {
                    $regex: search,
                    $options: "i"
                }
            },
            {
                email: {
                    $regex: search,
                    $options: "i"
                }
            }
        ]
    })
        .sort({ createdAt: -1 })
        .then(function (leads) {
            res.json(leads);
        })
        .catch(function (error) {
            console.log(error);

            res.status(500).json({
                message: "Unable to fetch leads"
            });
        });
});

// Update lead status - protected route
app.put("/lead/:id", verifyToken, function (req, res) {
    const leadId = req.params.id;
    const newStatus = req.body.status;

    const allowedStatuses = [
        "New",
        "Contacted",
        "Closed"
    ];

    if (!allowedStatuses.includes(newStatus)) {
        return res.status(400).json({
            message: "Invalid lead status"
        });
    }

    Lead.findByIdAndUpdate(
        leadId,
        {
            status: newStatus
        },
        {
            new: true
        }
    )
        .then(function (updatedLead) {
            if (!updatedLead) {
                return res.status(404).json({
                    message: "Lead not found"
                });
            }

            res.json({
                message: "Status updated successfully",
                lead: updatedLead
            });
        })
        .catch(function (error) {
            console.log(error);

            res.status(500).json({
                message: "Unable to update lead status"
            });
        });
});

// Start server
app.listen(port, function () {
    console.log("Server started on port " + port);
});