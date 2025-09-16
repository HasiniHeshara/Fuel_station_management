const express = require("express");
const mongoose = require("mongoose");


const Memberrouter = require("./Routes/MemberRoutes");


const app = express();


// Middleware
app.use(express.json());
app.use(cors());

app.use("/Members", Memberrouter);