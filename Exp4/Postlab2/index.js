const express = require("express");
const app = express();

app.set("view engine", "ejs");

app.get("/profile", (req, res) => {
    res.render("profile", {
        name: "Arlen Dmello",
        branch: "Computer Engineering",
        year: "SE"
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});