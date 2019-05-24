var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CartSchema = new Schema({
    bookId:String,
    numberOfBooks:Number
});
var WishlistSchema = new Schema({
    bookId:String
});
var OrderedBooksSchema = new Schema({
    bookId:String,
    numberOfBooks:Number,
    totalPrice:Number,
    status:String,
    transactionDate:Date,
    orderId:Number
});
var UserSchema = new Schema({
    fullName:String,
    preferredLoginName:String,
    password:String,
    email:String,
    address1:String,
    address2:String,
    city:String,
    state:String,
    zipCode:Number,
    phoneNumber:Number,
    mobileNumber:Number,
    typeOfUser:{
        type:String,
        default:"Customer"
    },
    order:[
        {
            orderId:Number,
            status:String
        }
    ],
    cart:[CartSchema],
    wishlist:[WishlistSchema],
    ordered:[OrderedBooksSchema]
});
var user = mongoose.model('User',UserSchema);
module.exports = user;


