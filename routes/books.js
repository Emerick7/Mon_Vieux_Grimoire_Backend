const express = require('express');
const auth = require('auth');
const router = express.Router();

const booksControllers = require('../controllers/books');

router.post('/', auth, booksControllers.createBook);
router.put('/:id', auth, booksControllers.modifyBook);
router.delete('/:id', auth, booksControllers.deleteBook);
router.get('/:id', booksControllers.getOneBook);
router.get('/', booksControllers.getAllBooks);
router.get('/bestrating', booksControllers.getBestRatingBooks);
router.post('/:id/rating', auth, booksControllers.postRatingBook);

module.exports = router;