const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

if (!fs.existsSync("./saveData")) fs.mkdirSync("./saveData");
const saveJSON = (data, fileName) => {
    fs.writeFile(fileName, JSON.stringify(data), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
}
const loadJSON = (fileName, defaultData = {}) => {
    if (!fs.existsSync(fileName)) {
        saveJSON(defaultData, fileName);
        return defaultData;
    }
    return JSON.parse(fs.readFileSync(fileName)) || {};
}

const users = loadJSON("./saveData/users.json");

app.use("*", (req, res, next) => {
    const uid = req.headers.authorization;
    req.headers.user = users[uid] || null;
    next();
});

app.use("/progress*", (req, res, next) => {
    const user = req.headers.user;
    if (!user) return res.status(201).send({ "error": "Not logged in" });
    next();
});

app.get("/progress*", (req, res) => {
    const { host, pathname } = req.query;
    res.send({
        "progress": "intro"
    });
});

app.post("/progress", (req, res) => {
    res.send({
        "progress": "100"
    });
});

app.use("*", (req, res) => {
    res.status(404).send("Not found");
});

app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});