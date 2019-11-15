const router = require('express').Router();
const Request = require('Request');
const uri = "http://localhost:3001";

const checkUser = function(req,res,next){
    if(req.session.login){
        next();
    }else{
        res.redirect('/guest/home');
    }
}

router.get('/home',checkUser, function (request, response) {
    response.render('UserHome.ejs');
});

router.get('/bookpdp',checkUser, function (request, response) {
    Request.get(`${uri}/bookapi/getbook/${request.query._id}`, function (err, res, data) {
        response.render('UserBookPdp.ejs', { "obj": JSON.parse(data) });
    })
})

router.get('/booksearch',checkUser, function (request, response) {
    response.render('UserBookSearch.ejs');
});

router.get('/shippingadressconfirmation',checkUser, function (request, response) {
    response.render('UserShippingAddress.ejs');
})

router.get('/wishlist',checkUser, function (request, response) {                //doubt please make it clear
    response.render('UserWishList.ejs');
});

router.get('/account',checkUser, function (request, response) {
    response.render('UserAccount.ejs');
});

router.get('/orderconfirmation',checkUser,function(request,response){
    response.render('UserOrderConfirmation.ejs');
});

router.get('/account',checkUser, function (request, response) {
    response.render('UserAccount.ejs');
});

router.get('/orderconfirmation',checkUser,function(request,response){
    response.render('UserOrderConfirmation.ejs');
});
    
router.get('/logout', function (request, response) {
    request.session.destroy();
    response.clearCookie('userId');
    response.redirect('/guest/home');
});


module.exports = router;