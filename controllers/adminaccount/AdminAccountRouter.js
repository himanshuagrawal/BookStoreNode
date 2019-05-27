const Router = require('express').Router();

Router.get('/home',function(req,res){
    res.render('AdminHome.ejs');
});

Router.get('/addbook',function(req,res){
    res.render('AdminAddBook.ejs');
});

Router.get('/editbook',function(req,res){
    res.render('AdminUpdateBook.ejs');
});

Router.get('/orders',function(req,res){
    res.render('AdminManageOrders.ejs');
})


module.exports=Router;