const express = require('express');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const router = express.Router();

const booksControllers = require('../controllers/books');

router.post('/', auth, multer.imageUploader.single('image'), multer.imgResize, booksControllers.createBook);
router.put('/:id', auth, multer.imageUploader.single('image'), multer.imgResize, booksControllers.modifyBook);
router.delete('/:id', auth, booksControllers.deleteBook);
router.get('/bestrating', booksControllers.getBestRatingBooks);
router.get('/:id', booksControllers.getOneBook);
router.get('/', booksControllers.getAllBooks);
router.post('/:id/rating', auth, booksControllers.postRatingBook);

module.exports = router;