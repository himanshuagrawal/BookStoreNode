const express = require('express');

const router = express.Router();

const users = require('../../db/js/UserCollectionOperation');

const apiAuthentication = function (request, response, next) {
    if (request.session.login) {
        next();
    } else {
        response.send("Please login first to use this api");
    }
}
//validate user authentication
router.get('/authenticateuser', function (request, response) {
    users.authenticateUser(request, response);
});

router.get('/checkpreferredusername', function (request, response) {
    users.checkPreferredUserName(response, request.query.name);
});

//adding user
router.post('/adduser', function (request, response) {
    users.addUser(response, request.body);
});


//api's which need authentication

//getting particular user details
router.get('/getuser', function (request, response) {
    users.getUser(response, request.query.userId);
});

router.post('/updateuser/:userId',function(request,response){
    users.updateUser(response,request.params.userId,request.body);
})

//adding book to cart
router.post('/addbooktocart', function (request, response) {
    users.addBookToCart(response, request.query.userId, request.body);
});

router.get('/updatecart',function(request,response){
    users.updatecart(response,request.query.userId,request.query.cartItemId,request.query.updatedCount);
})

//removing a book
router.get('/removebookfromcart', function (request, response) {
    users.removeBookFromCart(response, request.query.userId, request.query.cartItemId);
})

//getting wishlist
router.get('/getwishlist', function (request, response) {
    users.getwishlist(response, request.query.userId);
})

//adding items to wishlist
router.get('/addbooktowishlist', function (request, response) {
    users.addBookToWishlist(response, request.query.userId, request.query.bookId);
})

router.get('/removebookfromwishlist', function (request, response) {
    users.removeBookFromWishlist(response, request.query.userId, request.query.wishlistItemId);
})

//getting ordered books
router.get('/getorderedbooks', function (request, response) {
    users.getOrderedBooks(response, request.query.userId);
})

// adding cart to ordered list
router.get('/addorder', function (request, response) {
    let orderId = JSON.parse(request.cookies.orderdetails)[0].orderId;
    users.addOrder(request.query.userId, {
        'orderId': orderId,
        'status': "Processing"
    });
    users.addBookToOrderedBooks(response,request.query.userId,JSON.parse(request.cookies.orderdetails));
});

//getting order status
router.get('/getOrderStatus',function(request,response){
    users.getOrderStatus(response,request.query.userId,request.query.orderId);
})


//decrease the number of book count

module.exports = router;