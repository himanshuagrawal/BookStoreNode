const passport = require('passport');
const googleAuth = require('passport-google-oauth20');
const fbAuth = require('passport-facebook');
const keys = require('../Keys');

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.use(new googleAuth({
    callbackURL: "/guest/auth/google/verified",
    clientID: keys.passportGoogle.clientID,
    clientSecret: keys.passportGoogle.clientSecret
}, (accessToken, refreshToken, profile, done) => {
    done(null, profile);
}))

passport.use(new fbAuth({
    callbackURL: "/guest/auth/facebook/verified",
    clientID: keys.passportFacebook.clientID,
    clientSecret: keys.passportFacebook.clientSecret,
    profileFields: ['id', 'email', 'name']
}, (accessToken, refreshToken, profile, done) => {
    done(null, profile);
}))