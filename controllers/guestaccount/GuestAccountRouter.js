const router = require('express').Router();
const Request = require('Request');
const uri = "http://localhost:3001";


router.get('/home', function (request, response) {
    response.render('GuestHome.ejs');
});

router.get('/bookpdp',function(request,response){
    Request.get(`${uri}/bookapi/getbook/${request.query._id}`,function(err,res,data){
        response.render('GuestBookPdp.ejs',{"obj":JSON.parse(data)});
    })
})

router.get('/booksearch',function(request,response){
    response.render('GuestBookSearch.ejs');
})

router.get('/register',function(request,response){
    response.render('GuestRegister.ejs');
})

module.exports = router;