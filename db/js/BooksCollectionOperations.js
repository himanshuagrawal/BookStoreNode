const book = require('../models/book');

class booksCollection {
    constructor() { }
    getAllBooks(res) {
        book.find().sort('-ratingCount').then(function (result) {
            res.setHeader('Content-Type', "application/json");
            res.send(JSON.stringify(result));
        });
    }
    getBookById(res, id) {
        book.findById(id).then(function (result) {
            res.setHeader('Content-Type', "application/json");
            res.send(JSON.stringify(result));
        });
    }
    addComment(res, info, id) {
        book.findById(id).then(function (result) {
            result.comments.push(info);
            return result.save();
        }).then(() => { this.updateRatingAndCount(res, id) });
    }
    updateRatingAndCount(res, id) {
        book.findById(id).then(function (result) {
            let sumOfRating = 0;
            let ratingCounts = 0;
            let commentCounts=0
            result.comments.forEach((item) => {
                commentCounts++;
                if(item.rating!==null){
                    ratingCounts++;
                    sumOfRating += item.rating;
                }
            });
            if(ratingCounts!=0){
            sumOfRating = Math.floor((sumOfRating / ratingCounts)*10)/10;
            }
            return result.updateOne({ ratingCount: ratingCounts,rating:sumOfRating, commentCount: commentCounts });
        }).then(() => { this.getBookById(res, id) });
    }
    getAllComments(res, id) {
        book.findById(id).then(function (result) {
            res.send(result.comments);
        })
    }
    getBooksByCategory(res, category) {
        book.find({ 'categories': category }).then(function (result) {
            res.send(result);
        });
    }
    getSearchedBooks(res, criteria, sort) {
        book.find({ $and: [{ 'authors': { $regex: new RegExp(criteria.authors, "i") } }, { 'title': { $regex: new RegExp(criteria.title, "i") } }, { 'isbn': { $regex: new RegExp(criteria.isbn, "i") } }, { 'categories': { $regex: new RegExp(criteria.categories, "i") } }] })
        .then(function(result){
            res.send(result);
        })
    }
    addBook(res,obj){
        let newBook = new book(obj);
        newBook.save().then(()=>{
            res.send("Book Added Successfully");
        })
    }
    deleteBook(res,bookId){
        book.findByIdAndDelete(bookId).then(()=>{
            res.send("Book Deleted Successfully");
        });
    }
    updateBook(res,bookId,obj){
        book.findById(bookId).then((result)=>{
            result.updateOne(obj).then(()=>{
                res.send("Book Updated Successfully...!");
            })
        })
    }
}

module.exports = new booksCollection();