const express = require("express");
const multer = require("multer");

const {
    identifyPlant,
    getHistory,
    deleteHistory
} = require("../controllers/plantController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });


router.post("/identify", upload.single("image"), identifyPlant);
router.get("/history", getHistory);
router.delete("/history/:id", deleteHistory);


module.exports = router;