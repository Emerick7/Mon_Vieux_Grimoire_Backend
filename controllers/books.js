//const { request } = require('../app');
const Book = require('../models/Book');
const fs = require('fs');

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    book.save()
        .then(() => {res.status(201).json({ message: 'Book saved' })})
        .catch(error => {res.status(400).json({ error })});
};

exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete bookObject._userId;
    Book.findOne({_id: req.params.id})
        .then((book => {
            if(book.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not Authorized' });
            } else {
                Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
                    .then(() => res.status(200).json({ message: 'Book modified'}))
                    .catch(error => res.status(401).json({ error }));
            }
        }))
        .catch((error) => res.status(400).json({ error }));
};

exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id})
        .then(book => {
            if(book.userId != req.auth.userId) {
                res.status(401).json({ message: 'Unauthorized'})
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id})
                        .then(() => {res.status(200).json({ message: 'Book deleted'})})
                        .catch(error => res.status(401).json({ error }));
                })
            };
        })
        .catch(error => {
            res.status(500).json({ error })
        });
};

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id})
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({ error }));
};

exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
};

exports.getBestRatingBooks = (req, res, next) => {
    Book.find().sort({'averageRating':-1})
        .then(books => res.status(200).json(books[0, 1, 2]))
        .catch(error => res.status(400).json({ error }));
};

exports.postRatingBook = (req, res, next) => {
    const ratingObject = req.body;
    ratingObject.grade = ratingObject.rating;
    delete ratingObject.rating;

    Book.updateOne({ _id: req.params.id }, {$push: {ratings: ratingObject}})
        .then(() => res.status(200).json({ message: 'Rating sent'}))
        .catch(error => res.status(401).json({ error }));

    Book.findOne({ _id: req.params.id })
        .then((book) => {
                let averageRates = 0;
                for(i=0; i<book.ratings.length; i++){
                    averageRates += book.ratings[i].grade;
                };
                
                averageRates /= book.ratings.length;

                Book.updateOne({ _id: req.params.id }, {$set: {averageRating: averageRates}, _id: req.params.id})
                    .then(() => res.status(201).json({ message: 'Average Book rating updated'}))
                    .catch(error => res.status(401).json({ error }));
            }
        );
    //next();
};