const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Lead = require("./models/lead");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://lead-desk-mini-xi.vercel.app"
    ]
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
    .then(function () {
        console.log("MongoDB connected");
    })
    .catch(function (error) {
        console.log("MongoDB connection failed");
        console.log(error.message);
    });

app.get("/", function (req, res) {
    res.send("Welcome to LeadDesk Mini Backend");
});

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
                message: "Something went wrong"
            });
        });
});
app.get("/leads", function (req, res) {
    Lead.find()
        .then(function (leads) {
            res.json(leads);
        })
        .catch(function () {
            res.status(500).json({
                message: "Error fetching leads"
            });
        });
});
app.put("/lead/:id", function (req, res) {
    const leadId = req.params.id;
    const newStatus = req.body.status;

    Lead.findByIdAndUpdate(
        leadId,
        { status: newStatus },
        { new: true }
    )
        .then(function (updatedLead) {
            res.json({
                message: "Status updated successfully",
                lead: updatedLead
            });
        })
        .catch(function (error) {
            console.log(error);

            res.status(500).json({
                message: "Error updating status"
            });
        });
});

app.listen(port, function () {
    console.log("Server started on port " + port);
});