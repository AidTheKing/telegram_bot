var express = require("express");
var router = express.Router();

router.get("/test", (req, res, next) => {
  res.send({ message: "hello" });
});

router.post("/test", (req, res, next) => {
  res.send(req.body);
});

module.exports = router;
