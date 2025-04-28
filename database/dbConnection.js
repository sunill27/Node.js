const mongoose = require("mongoose")
const connectionString = "mongodb+srv://sunil57:sunil57@cluster0.8h1zsid.mongodb.net/?retryWrites=true&w=majority&appName=Cluster"

async function dbConnection(){
    await mongoose.connect(connectionString)
    console.log("Database connected successfully.")
}

module.exports = dbConnection