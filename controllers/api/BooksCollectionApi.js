const express = require('express');

const router = express.Router();

const books = require('../../db/js/BooksCollectionOperations');

//get all the books
router.get('/getallbooks',function(request,response){
    books.getAllBooks(response);
});
//getting a particular book
router.get('/getbook/:bookId',function(request,response){
    books.getBookById(response,request.params.bookId);
});

//adding a comment and review for a book
router.post('/getbook/:bookId/addcomment',function(request,response){
    books.addComment(response,request.body,request.params.bookId);
})

//getting the number of comments for a particular book
router.get('/getbook/:bookId/getallcomments',function(request,response){
    books.getAllComments(response,request.params.bookId);
})

//getting the books of a particular category
router.get('/getbooks',function(request,response){
    books.getBooksByCategory(response,request.query.category);
})

//getting the books depending the user's choice on the search page
router.get('/getsearchedbooks',function(request,response){
    let searchCriteria = {
        title:request.query.title,
        authors:request.query.author,
        isbn:request.query.isbn,
        categories:request.query.category
    }
    let sort = request.query.sort;
    books.getSearchedBooks(response,searchCriteria,sort);
})

module.exports = router;