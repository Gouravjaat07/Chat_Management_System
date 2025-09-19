const mongoose = require("mongoose");
const Chat = require("./models/chat");

main().then(() => {
    console.log("Connection successful");
}).catch((e) => {
    console.log(e);
})

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/fakewhatsapp")
}

let allChats = [
    {
        from: "Gautam",
        message: "Kya haal he bhai",
         to: "Gaurva Kumar"
    },{
        from: "Aditya",
        message: "Hello, Brother",
        to: "Gautam"
    },{
        from: "Ankush",
        message: "Bhai kal college aayega...",
        to: "Gautam"
    },{
        from: "Gourav",
        message: "Hlw, how are you",
        to: "Akansha"
    },{
        from: "Harsh",
        message: "Give me your notes bruhh",
        to: "Rajat"
    }
]

Chat.insertMany( allChats);

