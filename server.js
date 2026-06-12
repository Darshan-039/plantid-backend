const express = require("express");
const cors = require("cors");
require("dotenv").config();

const plantRoutes = require("./routes/plantRoutes");


const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/plants", plantRoutes);

app.get("/", (req, res) => {
    res.send("PlantID Backend Running");
});


app.get("/test", (req, res) => {
    res.json({ message: "Backend Working" });
});


app.listen(process.env.PORT, () => {
    console.log(`Server running on ${process.env.PORT}`);
});