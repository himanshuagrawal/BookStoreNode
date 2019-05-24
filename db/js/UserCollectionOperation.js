const user = require('../models/user');
const mongoose = require('mongoose');

class userCollection {
    constructor() { }
    authenticateUser(req, res) {
        user.find({ $and: [{ 'preferredLoginName': req.headers.preferredloginname }, { 'password': req.headers.password }] })
            .then(function (result) {
                if (result.length > 0) {
                    req.session.user = result[0];
                    req.session.login = true;
                    res.cookie('userId', result[0]._id.toString());
                    res.send(true);
                } else {
                    res.send(false);
                }
            })
    };

    getUserByName(res, obj) {
        user.find({ 'preferredLoginName': obj.preferredLoginName })
            .then(function (result) {
                res.send(result);
            });
    }

    checkPreferredUserName(res, name) {
        user.find({ 'preferredLoginName': name })
            .then(function (result) {
                if (result.length > 0) {
                    res.send(true);
                } else {
                    res.send(false);
                }
            })
    };

    addUser(res, userObj) {
        let newUser = new user(userObj);
        newUser.save()
            .then(() => {
                this.getUserByName(res, userObj);
            });
    };

    getUser(res, userId) {
        user.findById(userId)
            .then(function (result) {
                res.send(result);
            });
    };

    updateUser(res,userId,userObj){
        user.findByIdAndUpdate(userId,userObj).then(()=>{
            this.getUser(res,userId);
        })
    }

    addBookToCart(res, userId, obj) {
        let items;
        user.find({ $and: [{ '_id': mongoose.Types.ObjectId(userId) }, { "cart.bookId": obj.bookId }] })
            .then((result) =>{
                let itemId;
                if (result.length > 0) {
                    items=result[0].cart;
                    items.forEach(function(item){
                        if(item.bookId===obj.bookId){
                            itemId = item._id.toString();
                        }
                    });
                    let bookToUpdateCount = result[0].cart.id(itemId);
                    if(bookToUpdateCount.numberOfBooks<3){
                    bookToUpdateCount.numberOfBooks+=1;
                    result[0].save().then(()=>{
                        this.getUser(res,userId);
                    })
                }else{
                    res.send({'result':"Already exceeded the maximum limit"});
                }
                } else {
                    obj.numberOfBooks = 1;
                    user.findById(userId).then((result)=> {
                        result.cart.push(obj);
                        result.save().then( ()=> {
                            this.getUser(res, userId);
                        })
                    })
                }
            })
    };

    updatecart(res,userId,cartItemId,updatedCount){
        user.findById(userId).then((result)=>{
            let cartItem = result.cart.id(cartItemId);
            cartItem.numberOfBooks = updatedCount;
            result.save().then(()=>{
                this.getUser(res,userId);
            });
        })
    }
    removeBookFromCart(res,userId,cartItemId){
        user.findById(userId).then((result)=>{
            result.cart.id(cartItemId).remove();
            result.save().then(()=>{
                this.getUser(res, userId);
            });
        })
    };

    clearCart(res,userId){
        user.findById(userId).then(result=>{
            Array.from(result.cart).forEach((item)=>{
                result.cart.id(item._id).remove();
            })
            result.save().then(()=>{
                this.getUser(res,userId);
            })
        })
    }

    getwishlist(res,userId){
        user.findById(userId).then(function(result){
            res.send(result.wishlist);
        })
    }

    addBookToWishlist(res,userId,objId){
        user.find({ $and: [{ '_id': mongoose.Types.ObjectId(userId) }, { "wishlist.bookId": objId }] })
        .then((result)=>{
            if(result.length===0){
                user.findById(userId).then((result)=>{
                    result.wishlist.push({'bookId':objId});
                    result.save().then(()=>{
                        this.getUser(res,userId);
                    })
                })
            }else{
                res.send({'result':"Item already present in the wishlist"});
            }
        })
    }
    
    removeBookFromWishlist(res,userId,wishlistItemId){
        user.findById(userId).then((result)=>{
            result.wishlist.id(wishlistItemId).remove();
            result.save().then(()=>{
                this.getUser(res,userId);
            })
        })
    }

    getOrderedBooks(res,userId){
        user.findById(userId).then(function(result){
            res.send(result.ordered);
        })
    }

    addBookToOrderedBooks(res,userId,obj){
        user.findById(userId).then(result=>{
            Array.from(obj).forEach(function(item){
                result.ordered.push(item);
            })
            result.save().then(()=>{
                this.clearCart(res,userId);
            })
        })
    }

    addOrder(userId,obj){
        user.findById(userId).then((result)=>{
            result.order.push(obj);
            result.save();
        })
    }

    getOrderStatus(res,userId,orderId){
        let status="false";
        user.findById(userId).then(function(result){
            Array.from(result.order).forEach(function(item){
                if(parseInt(item.orderId)==orderId){
                    status=item.status;
                }
            });
            res.send(status);
        })
    }



}

module.exports = new userCollection();