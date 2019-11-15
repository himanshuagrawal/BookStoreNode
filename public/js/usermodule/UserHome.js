window.addEventListener('load', function () {
    let user;
    let userId;
    getUserDetails().then(function (data) {
        user = data;
        updateCartCount();
    });;

    //getting the user details
    function getUserDetails() {
        let cookieArray = document.cookie.split('=');
        cookieArray.forEach(function (item, index) {
            if (item.includes('userId')) {
                userId = cookieArray[index + 1].toString();
                userId = userId.split(';')[0];
            }
        });
        return fetch(`/userapi/getuser?userId=${userId}`)
            .then((response) => {
                return response.json();
            })
    };

    //update the cart count
    function updateCartCount() {
        document.querySelector('.cart-count').textContent = getCartCount();
    }

    //getting the cart count
    function getCartCount() {
        let count = 0;
        user.cart.forEach(function (item) {
            count += item.numberOfBooks;
        });
        return count;
    }

    let books;
    let count = 0;
    let bookContainer = document.querySelector('#bookContainer');
    if (location.hash === "") {
        getAllBooks();
    } else {
        populateCategoryBooks();
    }

    //functions for displaying all books i.e no category selected
    function getAllBooks() {
        fetch('/bookapi/getallbooks').then(function (response) {
            return response.json();
        }).then(function (data) {
            books = Array.from(data);
            addBooks();
        })
    }

    //function for displaying only the category books
    function populateCategoryBooks() {
        let category;
        category = location.hash.slice(1);
        getCategoryBooks(category);
        document.querySelector('#bookResultHeading').textContent = decodeURIComponent(category);
    }

    //making of a book
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
        price.textContent = `$${item.buyPrice}`;
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
        bookWrapper.setAttribute('href', `/user/bookpdp?_id=${item._id}`);
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
    //adding books function
    function addBooks() {
        let booksToAdd = books.slice(count * 30, count * 30 + 30);
        booksToAdd.forEach((item) => {
            let book = makeBook(item);
            bookContainer.append(book);
        });
        count++;
    }

    //getting particular category books
    function getCategoryBooks(category) {
        fetch(`/bookapi/getbooks?category=${category}`).then(function (response) {
            return response.json();
        }).then(function (data) {
            books = Array.from(data);
            count = 0;
            flushBooks();
            addBooks();
        })
    }

    //flushing the container
    function flushBooks() {
        while (bookContainer.firstChild) {
            bookContainer.removeChild(bookContainer.firstChild);
        }
    }

    // scroll listener
    window.addEventListener('scroll', function () {
        let key = $(window).scrollTop() + $(window).height();
        let dockey = $(document).height();
        let y = dockey - key;
        if (y <= 200) {
            addBooks();
        }
    });

    //books categories listener
    document.querySelector('.book-categories-list').addEventListener('click', function (event) {
        if (event.target.tagName === 'A') {
            if (!location.href.includes("/home")) {
                location.href = `/guest/home#${event.target.textContent}`;
            };
            Array.from(this.children).forEach(function (item) {
                item.style.backgroundColor = '#ffffff';
            });
            let category;
            setTimeout(function () {
                category = location.hash.slice(1);
                getCategoryBooks(category);
                event.target.style.backgroundColor = '#dfe5e6';
                document.querySelector('#bookResultHeading').textContent = decodeURIComponent(category);
            }, 0);
        }
    });

    //adding to cart button from homepage listener
    document.querySelector('.book-result').addEventListener('click', function (event) {
        if (event.target.tagName === "I") {
            event.preventDefault();
            var obj = {
                bookId: event.target.parentNode.parentNode.parentNode.getAttribute('_id'),
                typeOfBook: "Purchase"
            };
            fetch(`/userapi/addbooktocart?userId=${user._id}`, {
                method: "POST",
                body: JSON.stringify(obj),
                headers: {
                    'Content-Type': "Application/json"
                }
            }).then(function (response) {
                return response.json();
            }).then(function (data) {
                getUserDetails().then(function (data) {
                    user = data;
                    updateCartCount();
                    $('.cart-icon').click();
                })
            });
        };
    });


})
