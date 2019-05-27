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

//adding a book to the database
router.post('/addbooktodb',function(request,response){
    books.addBook(response,request.body);
})

//deleting a book from the database
router.get('/deletebookfromdb',function(request,response){
    books.deleteBook(response,request.query.bookId);
})

//update book in the db
router.post('/updatebookindb',function(request,response){
    books.updateBook(response,request.query.bookid,request.body);
})

module.exports = router;