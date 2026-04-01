const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));


app.use(express.static("public"));

app.post("/submit", (req, res) => {
    const { name, branch, year } = req.body;

    res.send(`
        <h2>Submitted Details</h2>
        <p>Student Name: ${name}</p>
        <p>Branch: ${branch}</p>
        <p>Year: ${year}</p>
    `);
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

// run commands
// npm init -y
// npm install express
// node index.js