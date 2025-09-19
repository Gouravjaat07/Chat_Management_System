const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError.js");


app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

main().then((res) => {
    console.log(res);
}).catch((e) => {
    console.log(e);
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/whatshap")
};

// AsyncFn Handler
function wrapAsync(fn) {
    return function(req, res, next) {
        fn(req, res, next).catch((err) => {next(err)}); 
    }
};

// Home route
app.get("/", (req, res) => {
    try {
        res.send("Home page");
    } catch(err) {
        throw new ExpressError(404, "Page doesn't exists");
    }
   
});

// Index Route
app.get("/chats", wrapAsync(async (req, res) => {
    let chats = await Chat.find();
    res.render("index.ejs", { chats });
}));

// New Route
app.get("/chats/new", (req, res) => {
    try {
        res.render("new.ejs");
    } catch(err) {
        throw new Error(401, "Page not fouund");
    };
    
});

// Show Route
app.get("/chats/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    if(!id) {
        throw new ExpressError(404, "Wrong Route");
    };
    res.render("show.ejs", {chat});
}));

// Create Route
app.post("/chats", wrapAsync(async (req, res) => {
    let { from, message, to } = req.body;
    let newChat = new Chat({
        from: from,
        message: message,
        to: to,
        created_at: new Date()
    });
    await newChat.save().then((res) => {
        console.log(res);
    }).catch((e) => {
        console.log(e);
    });
    res.redirect("/chats");
}));

// Edit Route
app.get("/chats/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs", { chat });
}));

// Update Route
app.post("/chats/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let{ message: newMessage } = req.body;
    let message =  await Chat.findByIdAndUpdate(id, { message: newMessage });
    console.log(message);
    res.redirect("/chats");
}));

// Delete Route
app.delete("/chats/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedChat = await Chat.findByIdAndDelete(id);
    console.log(deletedChat);
    res.redirect("/chats");
}));

// Mongoose Handling
const handleValidationErr = (err) => {
    console.log("Validation Error");
    console.dir(err);
    return err;
};

// Mongoose Handler
app.use((err, req, res, next) => {
    console.log(err.name);
    if(err === "ValidationError") {
        err = handleValidationErr(err);
    };
    next(err);
});

// Express Handler
app.use((err, req, res, next) => {
    let {status = 500, message = "Server have error"} = err;
    res.status(status).send(message);
});


// Server Starting
app.listen(port ,() => {
    console.log("Server is listening.");
});