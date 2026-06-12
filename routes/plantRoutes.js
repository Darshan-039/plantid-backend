const express = require("express");
const multer = require("multer");

const {
    identifyPlant,
    getHistory
} = require("../controllers/plantController");


const router = express.Router();
const upload = multer({ dest: "uploads/" });


router.post("/identify", upload.single("image"), identifyPlant);
router.get(
    "/history",
    getHistory
);

module.exports = router;