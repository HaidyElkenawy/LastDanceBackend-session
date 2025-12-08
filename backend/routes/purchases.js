const router = require("express").Router();
const auth = require("../middleware/auth");
const { buyBook, getPurchases } = require("../controllers/purchaseController");

router.post("/:bookId", auth, buyBook);
router.get("/", auth, getPurchases);

module.exports = router;
