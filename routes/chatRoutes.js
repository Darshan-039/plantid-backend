const express = require("express");
const router = express.Router();

const { askPlantQuestion } = require("../controllers/chatController");

router.post("/", askPlantQuestion);

module.exports = router;