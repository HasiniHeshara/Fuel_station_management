const express = require("express");
const mongoose = require("mongoose");


const Memberrouter = require("./Routes/MemberRoutes");
const ev = require('./Routes/EVRoutes');

const app = express();


// Middleware
app.use(express.json());
app.use(cors());

app.use("/Members", Memberrouter);
app.use("/ev", ev);
