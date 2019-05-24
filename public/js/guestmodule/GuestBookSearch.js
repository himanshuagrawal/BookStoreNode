window.addEventListener('load', function () {
    let books;
    let count = 0;
    let bookContainer = document.querySelector('#bookContainer');
    getAllBooks();

    //functions
    function getAllBooks() {
        fetch('/bookapi/getallbooks').then(function (response) {
            return response.json();
        }).then(function (data) {
            books = Array.from(data);
            addBooks();
        })
    }

    function makeBook(item) {
        //making elements
        let bookWrapper = document.createElement('a');
        bookWrapper.classList.add('card-wrapper');
        bookWrapper.setAttribute('id', 'bookWrapper');
        let book = document.createElement('div');
        book.classList.add('card');
        book.setAttribute('id', 'book');
        let bookImg = document.createElement('img');
        bookImg.classList.add('card-img-top');
        bookImg.setAttribute('id', 'bookImg');//need to add src and alt
        let bookBody = document.createElement('div');
        bookBody.classList.add('card-body');
        bookBody.setAttribute('id', 'bookBody');
        let bookTitle = document.createElement('h5');
        bookTitle.classList.add('card-title');
        bookTitle.setAttribute('id', 'bookTitle');
        let bookAuthor = document.createElement('h5');
        bookAuthor.classList.add('card-title');
        bookAuthor.classList.add('card-author');
        bookAuthor.setAttribute('id', 'bookAuthor');

        //making price and cart button
        let priceCartWrapper = document.createElement('div');
        priceCartWrapper.classList.add('book-price-cart');
        let price = document.createElement('h2');
        price.classList.add('book-price-tag');
        let cart = document.createElement('i');
        cart.classList.add('fas');
        cart.classList.add('fa-shopping-cart');
        cart.classList.add('book-cart-btn');
        price.textContent=`$${item.buyPrice}`;
        priceCartWrapper.append(price);
        priceCartWrapper.append(cart);

        //making stars
        let starWrapper = document.createElement('div');
        starWrapper.classList.add('book-rating');
        starWrapper.setAttribute('id', 'bookCommentRating');
        let outerStar = document.createElement('div');
        outerStar.classList.add('stars-outer');
        let innerStar = document.createElement('div');
        innerStar.classList.add('stars-inner');
        innerStar.classList.add('commentRating');
        innerStar.style.width = `${item.rating * 20}%`;
        outerStar.append(innerStar);
        starWrapper.append(outerStar);

        //setting attributes
        bookWrapper.setAttribute('href', `/guest/bookpdp?_id=${item._id}`);
        bookWrapper.setAttribute('_id', item._id);
        bookImg.setAttribute('src', item.thumbnailUrl);
        bookImg.setAttribute('alt', item.title);
        if (item.title.length > 20) {
            bookTitle.textContent = item.title.slice(0, 15) + " ...";
        } else {
            bookTitle.textContent = item.title;
        }

        if (item.authors[0] !== undefined && item.authors[0].length > 20) {
            bookAuthor.textContent = item.authors[0].slice(0, 15) + " ...";
        } else {
            bookAuthor.textContent = item.authors[0];
        }
        //appending elements
        bookBody.append(bookTitle);
        bookBody.append(bookAuthor);
        bookBody.append(starWrapper);
        book.append(bookImg);
        book.append(bookBody);
        book.append(priceCartWrapper);
        bookWrapper.append(book);
        return bookWrapper;
    }

    function addBooks() {
        let booksToAdd = books.slice(count * 30, count * 30 + 30);
        booksToAdd.forEach((item) => {
            let book = makeBook(item);
            bookContainer.append(book);
        });
        count++;
    }

    function flushBooks() {
        while (bookContainer.firstChild) {
            bookContainer.removeChild(bookContainer.firstChild);
        }
    }


    //listeners
    window.addEventListener('scroll', function () {
        let key = $(window).scrollTop() + $(window).height();
        let dockey = $(document).height();
        let y = dockey - key;
        if (y <= 200) {
            addBooks();
        }
    });


    //adding search listeners
    let inputFields = document.getElementsByTagName('input');
    let bookAuthor;
    let bookTitle;
    let isbn;
    let category;
    Array.from(inputFields).forEach(function (item) {
        item.addEventListener('keyup', function () {
            getData();
        })
    });
    document.querySelector('#bookSearchCategory').addEventListener('change',function(){
        getData();
    })

    function getData() {
        bookAuthor = document.querySelector('#bookSearchAuthor').value;
        bookTitle = document.querySelector('#bookSearchTitle').value;
        isbn = document.querySelector('#bookSearchIsbn').value;
        category = document.querySelector('#bookSearchCategory').value;
        fetch(`/bookapi/getsearchedbooks?author=${bookAuthor}&title=${bookTitle}&isbn=${isbn}&category=${category}`)
            .then(function (response) {
                return response.json();
            }).then(function (data) {
                flushBooks();
                count = 0;
                books = Array.from(data);
                addBooks();
            })
    } 
    
    //adding books categories listener
    document.querySelector('.book-categories-list').addEventListener('click', function (event) {
        if (event.target.tagName === 'A') {
            location.href = `/guest/home#${event.target.textContent}`;
        }
    });
    
     //adding to cart button from homepage listener
     document.querySelector('.book-result').addEventListener('click',function(event){
        if(event.target.tagName==="I"){
        event.preventDefault();
        $('#loginModal').modal('show');
    };
    });


})
