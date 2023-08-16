//jshint esversion:6
require("dotenv").config();
require('@octokit/rest');

const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));

const urlDb = "mongodb://localhost:27017/userDB";
mongoose.connect(urlDb, {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

app.get("/", ((req, res)=>{
    res.render("home")
}));


app.get("/login", ((req, res)=>{
    res.render("login")
}));

app.get("/register", ((req, res)=>{
    res.render("register")
}));

app.post("/register", ((req, res)=>{
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save().then(()=>{
        console.log("Successfully saved")
        res.render("secrets")
    })

}));

app.post("/login", ((req, res)=>{
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}).then((err, foundUser)=>{
        if(foundUser){
            if(foundUser.password === password){
                res.render("secrets");
            }
        }else {
            res.render("register")
        }
    });
    
}));



app.listen(3000, (()=>{
console.log("the server started on port 3000");
}));
