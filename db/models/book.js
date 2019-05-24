const mongoose  = require('mongoose');

const Schema = mongoose.Schema;

var bookSchema = new Schema({
    bookId:Number,
    title:String,
    isbn:String,
    pageCount:{
        type:Number,
        default:200
},
    publishedDate:{
        date:String
    },
    thumbnailUrl:String,
    shortDescription:String,
    longDescription:{
        type:String,
        default:"Not Availaible"
    },
    status:String,
    authors:{
        type:Array,
        default:["Unknown"]
    },
    categories:Array,
    rating:{
        type:Number,
        default:0
    },
    ratingCount:{
        type:Number,
        default:0
    },
    commentCount:{
        type:Number,
        default:0
    },
    comments:[{username:String,comment:String,rating:Number,date:Date}],
    buyPrice:{
        type:Number,
        default:Math.floor(Math.random()*999)+150
    },
    rentPrice:{
        type:Number,
        default:Math.floor(Math.random()*100)+50
    },
    numberOfBooks:{
        type:Number,
        default:Math.floor(Math.random()*20)+5
    }
});

var book = mongoose.model("Book",bookSchema);

module.exports = book;