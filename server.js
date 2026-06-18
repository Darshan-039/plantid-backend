const express = require("express");
const cors = require("cors");
require("dotenv").config();

const plantRoutes = require("./routes/plantRoutes");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");



const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/plants", plantRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);


app.get("/", (req, res) => {
    res.send("PlantID Backend Running");
});


app.get("/test", (req, res) => {
    res.json({ message: "Backend Working" });
});


app.listen(process.env.PORT, () => {
    console.log(`Server running on ${process.env.PORT}`);
});