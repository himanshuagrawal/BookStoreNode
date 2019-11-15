const router = require('express').Router();
const Request = require('Request');
const uri = "http://localhost:3001";
const passport = require('passport');


router.get('/home', function (request, response) {
    response.render('GuestHome.ejs');
});

router.get('/bookpdp', function (request, response) {
    Request.get(`${uri}/bookapi/getbook/${request.query._id}`, function (err, res, data) {
        response.render('GuestBookPdp.ejs', { "obj": JSON.parse(data) });
    })
})

router.get('/booksearch', function (request, response) {
    response.render('GuestBookSearch.ejs');
})

router.get('/register', function (request, response) {
    response.render('GuestRegister.ejs');
})

router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}))

router.get('/auth/google/verified', passport.authenticate('google'), function (req, res) {
    let user_profile = {
        thirdPartyID: req.user.id,
        typeOfUser: 'Customer',
        fullName: req.user.displayName,
        email: req.user.emails[0].value
    }
    Request.post(`${uri}/userapi/authenticateuserbythirdpartyid`, {
        method: 'POST',
        body: JSON.stringify(user_profile),
        headers: {
            'Content-Type': 'application/json'
        }
    }, function (err, ress, data) {
        data=JSON.parse(data);
        req.session.user = data;
        req.session.login = true;
        res.cookie('userId', data._id.toString());
        res.redirect('/user/home');
    })
})

router.get('/auth/facebook', passport.authenticate('facebook'))

router.get('/auth/facebook/verified', passport.authenticate('facebook'), function (req, res) {
    let user_profile = {
        thirdPartyID: req.user.id,
        typeOfUser: 'Customer',
        fullName: req.user.name.givenName + " " + req.user.name.familyName
    }
    Request.post(`${uri}/userapi/authenticateuserbythirdpartyid`, {
        method: 'POST',
        body: JSON.stringify(user_profile),
        headers: {
            'Content-Type': 'application/json'
        }
    }, function (err, ress, data) {
        data=JSON.parse(data);
        req.session.user = data;
        req.session.login = true;
        res.cookie('userId', data._id.toString());
        res.redirect('/user/home#');
    })
})


module.exports = router;