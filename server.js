const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
var request = require("request");

const axios = require("axios");
const app = express();

app.use(bodyParser.json());

const code = `#include <iostream>
                using namespace std;
                int main() {
                    int x=10;
                    int y=25;
                    int z=x+y;
                    cout<<"Sum of x+y = " << z;
                }`;

// const proxyurl = "https://cors-anywhere.herokuapp.com/";
const url = "https://api.jdoodle.com/v1/execute";

app.post("/", (req, res) => {
    console.log(req.body.lang);
    const program = {
        script: req.body.code,
        stdin: req.body.input,
        language: req.body.lang,
        versionIndex: "0",
        clientId: "eaf35e03559fa425515fa438fad5fce0",
        clientSecret: "68eee9bc9e9d5fbb84fbd1c97cca807718f334ef1f6f42ee362833ba137a5202",
    };
    request(
        {
            url: url,
            method: "POST",
            json: program,
        },
        function (error, response, body) {
            res.json(body);
            console.log("error:", error);
            console.log("statusCode:", response && response.statusCode);
            console.log("body:", body);
        }
    );
});

// production

if (process.env.NODE_ENV === "production") {
    app.use(express.static("app/build"));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "app", "build", "index.html"));
    });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server started on port ${port}`));
