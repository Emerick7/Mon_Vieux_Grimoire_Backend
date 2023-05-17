const express = require('express');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const router = express.Router();

const booksControllers = require('../controllers/books');

router.post('/', auth, multer, booksControllers.createBook);
router.put('/:id', auth, multer, booksControllers.modifyBook);
router.delete('/:id', auth, booksControllers.deleteBook);
router.get('/:id', booksControllers.getOneBook);
router.get('/', booksControllers.getAllBooks);
router.get('/bestrating', booksControllers.getBestRatingBooks);
router.post('/:id/rating', auth, booksControllers.postRatingBook);

module.exports = router;