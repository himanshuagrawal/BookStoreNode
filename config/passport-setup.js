const passport  = require('passport');
const googleAuth = require('passport-google-oauth20');
const keys  = require('../Keys');

passport.use(new googleAuth({
    clientID:keys.passportGoogle.clientID,
    clientSecret:keys.passportGoogle.clientSecret
}))