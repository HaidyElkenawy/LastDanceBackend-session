const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");

router.route("/").get(getBooks).post(auth, createBook);

router.route("/:id").put(auth, updateBook).delete(auth, deleteBook);

module.exports = router;
